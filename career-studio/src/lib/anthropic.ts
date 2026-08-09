const API_URL = "https://api.anthropic.com/v1/messages";
const DEFAULT_MODEL = "claude-sonnet-4-6";
const REQUEST_TIMEOUT_MS = 3 * 60 * 1_000;

type ContentBlock = {
  type: string;
  text?: string;
  citations?: Array<{ url?: string; title?: string; [key: string]: unknown }>;
  [key: string]: unknown;
};
type ClaudeResponse = {
  content: ContentBlock[];
  stop_reason: string;
};

type StreamEvent = {
  type: string;
  index?: number;
  message?: { content?: ContentBlock[]; stop_reason?: string | null };
  content_block?: ContentBlock;
  delta?: Record<string, unknown>;
  error?: { type?: string; message?: string };
};

function claudeError(response: Response, detail: string): Error {
  const requestId = response.headers.get("request-id");
  const suffix = requestId ? ` Request ID: ${requestId}.` : "";

  if (response.status === 524 || response.status === 504) {
    return new Error(`Claude request timed out (${response.status}). Please try again.${suffix}`);
  }

  if (response.status >= 500 || response.status === 429) {
    return new Error(
      `Claude is temporarily unavailable (${response.status}). Please try again.${suffix}`,
    );
  }

  return new Error(
    `Claude request failed (${response.status}): ${detail.slice(0, 500)}${suffix}`,
  );
}

function applyStreamEvent(
  response: ClaudeResponse,
  partialJson: Map<number, string>,
  event: StreamEvent,
): boolean {
  if (event.type === "message_start") {
    response.content = event.message?.content ?? [];
    if (event.message?.stop_reason) response.stop_reason = event.message.stop_reason;
    return false;
  }

  if (event.type === "content_block_start" && event.index !== undefined) {
    response.content[event.index] = event.content_block ?? { type: "unknown" };
    return false;
  }

  if (event.type === "content_block_delta" && event.index !== undefined) {
    const block = response.content[event.index];
    const delta = event.delta;
    if (!block || !delta) return false;

    if (delta.type === "text_delta" && typeof delta.text === "string") {
      block.text = `${block.text ?? ""}${delta.text}`;
    } else if (delta.type === "citations_delta" && delta.citation) {
      (block.citations ??= []).push(
        delta.citation as NonNullable<ContentBlock["citations"]>[number],
      );
    } else if (
      delta.type === "input_json_delta" &&
      typeof delta.partial_json === "string"
    ) {
      partialJson.set(
        event.index,
        `${partialJson.get(event.index) ?? ""}${delta.partial_json}`,
      );
    }
    return false;
  }

  if (event.type === "content_block_stop" && event.index !== undefined) {
    const input = partialJson.get(event.index);
    if (input !== undefined) {
      response.content[event.index].input = input ? JSON.parse(input) : {};
      partialJson.delete(event.index);
    }
    return false;
  }

  if (event.type === "message_delta") {
    if (typeof event.delta?.stop_reason === "string") {
      response.stop_reason = event.delta.stop_reason;
    }
    return false;
  }

  if (event.type === "error") {
    throw new Error(
      `Claude stream failed (${event.error?.type ?? "unknown_error"}): ${event.error?.message ?? "Unknown streaming error"}`,
    );
  }

  return event.type === "message_stop";
}

function parseSseRecord(record: string): StreamEvent | undefined {
  const data = record
    .split(/\r?\n/)
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice(5).trimStart())
    .join("\n");
  return data ? (JSON.parse(data) as StreamEvent) : undefined;
}

async function readClaudeStream(body: ReadableStream<Uint8Array>): Promise<ClaudeResponse> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  const response: ClaudeResponse = { content: [], stop_reason: "" };
  const partialJson = new Map<number, string>();
  let buffer = "";
  let complete = false;

  function consumeRecords(flush = false) {
    buffer = buffer.replace(/\r\n/g, "\n");
    const records = buffer.split("\n\n");
    buffer = flush ? "" : (records.pop() ?? "");

    for (const record of records) {
      const event = parseSseRecord(record);
      if (event && applyStreamEvent(response, partialJson, event)) complete = true;
    }
  }

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    consumeRecords();
  }
  buffer += decoder.decode();
  consumeRecords(true);

  if (!complete) throw new Error("Claude's response stream ended unexpectedly. Please try again.");
  return response;
}

async function requestClaude(
  env: CloudflareEnv,
  body: Record<string, unknown>,
): Promise<ClaudeResponse> {
  if (!env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not configured.");
  }

  const signal = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
  let response: Response;
  try {
    response = await fetch(API_URL, {
      method: "POST",
      signal,
      headers: {
        accept: "text/event-stream",
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
        "x-api-key": env.ANTHROPIC_API_KEY,
      },
      body: JSON.stringify({
        model: env.ANTHROPIC_MODEL || DEFAULT_MODEL,
        max_tokens: 8_000,
        ...body,
        stream: true,
      }),
    });
  } catch (error) {
    if (signal.aborted) {
      throw new Error("Claude request exceeded the three-minute safety limit.");
    }
    throw error;
  }

  if (!response.ok) {
    const detail = await response.text();
    throw claudeError(response, detail);
  }

  if (!response.body) throw new Error("Claude returned an empty response stream.");
  try {
    return await readClaudeStream(response.body);
  } catch (error) {
    if (signal.aborted) {
      throw new Error("Claude request exceeded the three-minute safety limit.");
    }
    throw error;
  }
}

export async function claudeJson<T>(
  env: CloudflareEnv,
  system: string,
  prompt: string,
  schema: Record<string, unknown>,
  maxTokens = 8_000,
): Promise<T> {
  const response = await requestClaude(env, {
    system,
    messages: [{ role: "user", content: prompt }],
    max_tokens: maxTokens,
    output_config: { format: { type: "json_schema", schema } },
  });
  const text = response.content.find((block) => block.type === "text")?.text;
  if (!text) throw new Error("Claude returned no structured output.");
  return JSON.parse(text) as T;
}

export async function claudeText(
  env: CloudflareEnv,
  system: string,
  prompt: string,
  maxTokens = 8_000,
): Promise<string> {
  const response = await requestClaude(env, {
    system,
    messages: [{ role: "user", content: prompt }],
    max_tokens: maxTokens,
  });
  return response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text ?? "")
    .join("\n")
    .trim();
}

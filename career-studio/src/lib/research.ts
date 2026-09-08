export type ResearchCategory =
  | "company-product"
  | "culture-practices"
  | "role-context";

export type ResearchRootPlan = {
  roots: Array<{ url: string; reason: string }>;
};

export type ResearchSource = {
  url: string;
  title: string;
  category: ResearchCategory;
  reason: string;
};

export type ResearchSourcePlan = { sources: ResearchSource[] };

export type FetchedResearchSource = ResearchSource & {
  markdown: string;
  error?: string;
};

type QuickActionResult<T> = {
  success: boolean;
  result?: T;
  errors?: Array<{ message?: string }>;
};

const RELEVANT_PATH =
  /about|career|job|blog|news|press|product|engineering|technology|company|culture|values|team|platform|ai/i;

export function normalizeResearchUrl(value: string | undefined): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    if (!/^https?:$/.test(url.protocol) || url.username || url.password) return undefined;
    const hostname = url.hostname.toLowerCase();
    if (
      hostname === "localhost" ||
      hostname.endsWith(".local") ||
      hostname === "0.0.0.0" ||
      hostname === "127.0.0.1" ||
      hostname === "::1" ||
      /^10\./.test(hostname) ||
      /^192\.168\./.test(hostname) ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(hostname)
    ) {
      return undefined;
    }
    url.hash = "";
    return url.toString();
  } catch {
    return undefined;
  }
}

export function extractHttpUrls(text: string): string[] {
  const matches = text.match(/https?:\/\/[^\s<>"')\]]+/g) ?? [];
  return uniqueUrls(matches);
}

export function uniqueUrls(values: Array<string | undefined>): string[] {
  const urls = new Map<string, string>();
  for (const value of values) {
    const normalized = normalizeResearchUrl(value);
    if (normalized) urls.set(normalized, normalized);
  }
  return [...urls.values()];
}

export function rankCandidateUrls(roots: string[], discovered: string[]): string[] {
  const rootHosts = new Set(roots.map((value) => new URL(value).hostname));
  return uniqueUrls([...roots, ...discovered])
    .map((url, order) => {
      const parsed = new URL(url);
      const sameHost = rootHosts.has(parsed.hostname) ? 1 : 0;
      const relevant = RELEVANT_PATH.test(`${parsed.hostname}${parsed.pathname}`) ? 1 : 0;
      return { url, order, score: sameHost * 2 + relevant * 3 };
    })
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .slice(0, 200)
    .map(({ url }) => url);
}

async function parseQuickAction<T>(response: Response, action: string): Promise<T> {
  const payload = (await response.json()) as QuickActionResult<T>;
  if (!response.ok || !payload.success || payload.result === undefined) {
    const detail = payload.errors?.map((error) => error.message).filter(Boolean).join("; ");
    throw new Error(`${action} failed (${response.status})${detail ? `: ${detail}` : ""}`);
  }
  return payload.result;
}

export async function discoverResearchLinks(
  env: CloudflareEnv,
  url: string,
): Promise<string[]> {
  const response = await env.BROWSER.quickAction("links", {
    url,
    excludeExternalLinks: false,
    gotoOptions: { timeout: 45_000, waitUntil: "domcontentloaded" },
    actionTimeout: 30_000,
    bestAttempt: true,
    cacheTTL: 300,
  });
  return uniqueUrls(await parseQuickAction<string[]>(response, "Link discovery"));
}

export async function fetchResearchMarkdown(
  env: CloudflareEnv,
  url: string,
): Promise<string> {
  const response = await env.BROWSER.quickAction("markdown", {
    url,
    gotoOptions: { timeout: 45_000, waitUntil: "domcontentloaded" },
    actionTimeout: 45_000,
    bestAttempt: true,
    cacheTTL: 300,
    rejectResourceTypes: ["image", "media", "font"],
  });
  const markdown = await parseQuickAction<string>(response, "Page retrieval");
  if (!markdown.trim()) throw new Error("Page retrieval returned no readable content.");
  return markdown.trim();
}

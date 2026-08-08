"use client";

import { MarkdownText } from "@/components/thread/markdown-text";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowUp,
  Github,
  SquarePen,
  StopCircle,
} from "lucide-react";
import Link from "next/link";
import {
  FormEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const DEFAULT_STARTERS = [
  "What kind of roles is David looking for?",
  "Tell me about David's frontend experience.",
  "What makes David different as an engineering leader?",
];

type JobProfile = {
  companyName: string;
  recruiterName: string;
};

function messageId() {
  return crypto.randomUUID();
}

export function AgentChat({
  jobId,
  jobProfile,
}: {
  jobId?: string;
  jobProfile?: JobProfile;
}) {
  const storageKey = `david-agent-chat:${jobId ?? "general"}`;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [error, setError] = useState<string>();
  const abortController = useRef<AbortController | null>(null);
  const scrollAnchor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      setMessages(saved ? JSON.parse(saved) : []);
    } catch {
      setMessages([]);
    }
    setIsHydrated(true);
  }, [storageKey]);

  useEffect(() => {
    if (isHydrated) {
      window.localStorage.setItem(storageKey, JSON.stringify(messages));
    }
  }, [isHydrated, messages, storageKey]);

  useEffect(() => {
    scrollAnchor.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => () => abortController.current?.abort(), []);

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || isLoading) return;

      const userMessage: ChatMessage = {
        id: messageId(),
        role: "user",
        content: trimmed,
      };
      const assistantId = messageId();
      const requestMessages = [...messages, userMessage];

      setMessages([
        ...requestMessages,
        { id: assistantId, role: "assistant", content: "" },
      ]);
      setInput("");
      setError(undefined);
      setIsLoading(true);

      const controller = new AbortController();
      abortController.current = controller;

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jobId,
            messages: requestMessages.map(({ role, content }) => ({
              role,
              content,
            })),
          }),
          signal: controller.signal,
        });

        if (!response.ok || !response.body) {
          const result = await response.json().catch(() => null);
          throw new Error(result?.error || "The assistant could not respond.");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          setMessages((current) =>
            current.map((message) =>
              message.id === assistantId
                ? { ...message, content: message.content + chunk }
                : message,
            ),
          );
        }
      } catch (caught) {
        if ((caught as Error).name === "AbortError") {
          setMessages((current) =>
            current.filter(
              (message) => message.id !== assistantId || message.content,
            ),
          );
        } else {
          setMessages((current) =>
            current.filter((message) => message.id !== assistantId),
          );
          setError(
            caught instanceof Error
              ? caught.message
              : "The assistant could not respond.",
          );
        }
      } finally {
        abortController.current = null;
        setIsLoading(false);
      }
    },
    [isLoading, jobId, messages],
  );

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    void sendMessage(input);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  function startNewConversation() {
    abortController.current?.abort();
    setMessages([]);
    setInput("");
    setError(undefined);
  }

  const hasMessages = messages.length > 0;
  const recruiterFirstName = jobProfile?.recruiterName.split(/\s+/)[0];
  const starters = jobProfile
    ? [
        `Why is David a strong fit for ${jobProfile.companyName}?`,
        "Which parts of David's experience are most relevant to this role?",
        "What would David bring to the team?",
      ]
    : DEFAULT_STARTERS;

  return (
    <main className="flex h-dvh flex-col bg-white text-zinc-950">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-200 px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="rounded-md p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2"
            aria-label="Back to David Jackson's homepage"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <div>
            <p className="font-semibold tracking-tight">Ask about David</p>
            <p className="text-xs text-zinc-500">AI portfolio assistant</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <a
            href="https://github.com/iamdavidjackson"
            target="_blank"
            rel="noreferrer"
            className="rounded-md p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2"
            aria-label="David Jackson on GitHub"
          >
            <Github className="size-5" />
          </a>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={startNewConversation}
            aria-label="Start a new conversation"
          >
            <SquarePen className="size-5" />
          </Button>
        </div>
      </header>

      <section className="min-h-0 flex-1 overflow-y-auto px-4">
        <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col">
          {!hasMessages && (
            <div className="my-auto py-16">
              <p className="font-mono text-sm uppercase tracking-[0.2em] text-amber-600">
                {jobProfile?.companyName || "David Jackson"}
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                {jobProfile
                  ? `Hi ${recruiterFirstName || "there"} — welcome.`
                  : "What would you like to know?"}
              </h1>
              <p className="mt-4 max-w-xl text-lg leading-8 text-zinc-500">
                {jobProfile ? (
                  <>
                    David put this assistant together to help you explore his
                    experience and how it connects with the opportunity at{" "}
                    {jobProfile.companyName}. Ask anything you&apos;d find useful.
                  </>
                ) : (
                  <>
                    Ask about David&apos;s experience, technical background,
                    leadership, education, or the kind of work he&apos;s looking
                    for.
                  </>
                )}
              </p>

              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                {starters.map((starter) => (
                  <button
                    key={starter}
                    type="button"
                    className="rounded-xl border border-zinc-200 p-4 text-left text-sm leading-6 text-zinc-700 transition-colors hover:border-amber-400 hover:bg-amber-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
                    onClick={() => void sendMessage(starter)}
                  >
                    {starter}
                  </button>
                ))}
              </div>
            </div>
          )}

          {hasMessages && (
            <div className="flex flex-col gap-7 py-10">
              {messages.map((message) => (
                <article
                  key={message.id}
                  className={
                    message.role === "user"
                      ? "ml-auto max-w-[85%] rounded-3xl bg-zinc-100 px-4 py-2.5 whitespace-pre-wrap"
                      : "mr-auto max-w-full leading-7"
                  }
                >
                  {message.role === "assistant" ? (
                    message.content ? (
                      <MarkdownText>{message.content}</MarkdownText>
                    ) : (
                      <span
                        className="inline-flex gap-1 rounded-2xl bg-zinc-100 px-4 py-3"
                        aria-label="David's assistant is thinking"
                      >
                        <span className="size-1.5 animate-pulse rounded-full bg-zinc-500" />
                        <span className="size-1.5 animate-pulse rounded-full bg-zinc-500 [animation-delay:150ms]" />
                        <span className="size-1.5 animate-pulse rounded-full bg-zinc-500 [animation-delay:300ms]" />
                      </span>
                    )
                  ) : (
                    message.content
                  )}
                </article>
              ))}
              <div ref={scrollAnchor} />
            </div>
          )}
        </div>
      </section>

      <footer className="shrink-0 bg-gradient-to-t from-white via-white to-white/0 px-4 pb-4 pt-6 sm:pb-6">
        <div className="mx-auto w-full max-w-3xl">
          {error && (
            <p
              className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
              role="alert"
            >
              {error}
            </p>
          )}
          <form
            onSubmit={handleSubmit}
            className="flex items-end gap-2 rounded-2xl border border-zinc-300 bg-white p-2 shadow-lg shadow-zinc-950/5 focus-within:border-zinc-500"
          >
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question about David..."
              rows={1}
              maxLength={8_000}
              className="max-h-40 min-h-11 flex-1 resize-none bg-transparent px-3 py-2.5 text-base outline-none placeholder:text-zinc-400"
              aria-label="Message"
            />
            {isLoading ? (
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={() => abortController.current?.abort()}
                aria-label="Stop response"
              >
                <StopCircle className="size-5" />
              </Button>
            ) : (
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim()}
                aria-label="Send message"
              >
                <ArrowUp className="size-5" />
              </Button>
            )}
          </form>
          <p className="mt-2 text-center text-xs text-zinc-400">
            AI can make mistakes. Contact David to confirm important details.
          </p>
        </div>
      </footer>
    </main>
  );
}

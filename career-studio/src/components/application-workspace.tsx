"use client";

import {
  ArrowLeft,
  Check,
  Download,
  FileText,
  LoaderCircle,
  Search,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

type Application = {
  id: string;
  company: string;
  job_title: string;
  job_url: string | null;
  recruiter_name: string | null;
  job_description: string;
  notes: string | null;
  status: string;
  stage: string;
  error: string | null;
  created_at: string;
};

type Artifact = { kind: string; format: string };
type ApplicationData = {
  application: Application;
  artifacts: Artifact[];
  workflowStatus: { status: string };
  fitAnalysis: string | null;
};

const STAGES = [
  ["analyzing-job", "Analyze the role"],
  ["planning-research", "Choose research sources"],
  ["retrieving-sources", "Retrieve source pages"],
  ["analyzing-research", "Analyze the research"],
  ["matching-evidence", "Match your evidence"],
  ["awaiting-review", "Review the strategy"],
  ["review-submitted", "Apply your decision"],
  ["generating-documents", "Generate documents"],
  ["rendering-pdfs", "Render PDFs"],
  ["complete", "Application kit ready"],
] as const;

const LABELS: Record<string, string> = {
  "fit-analysis": "Fit analysis",
  resume: "Custom resume",
  "cover-letter": "Cover letter",
  "interview-prep": "Interview prep",
  "application-brief": "Application brief",
  "research-manifest": "Research source manifest",
  "company-research": "Company research",
  validation: "Validation report",
};

export function ApplicationWorkspace({ applicationId }: { applicationId: string }) {
  const [data, setData] = useState<ApplicationData>();
  const [error, setError] = useState<string>();
  const [reviewNotes, setReviewNotes] = useState("");
  const [isReviewing, setIsReviewing] = useState(false);

  const load = useCallback(async () => {
    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        cache: "no-store",
      });
      const result = (await response.json()) as ApplicationData & { error?: string };
      if (!response.ok) throw new Error(result.error || "Unable to load application.");
      setData(result);
      setError(undefined);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to load application.");
    }
  }, [applicationId]);

  useEffect(() => {
    void load();
    const timer = window.setInterval(() => void load(), 4_000);
    return () => window.clearInterval(timer);
  }, [load]);

  async function review(approved: boolean) {
    setIsReviewing(true);
    setError(undefined);
    try {
      const response = await fetch(`/api/applications/${applicationId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved, notes: reviewNotes }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Unable to submit review.");
      await load();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to submit review.");
    } finally {
      setIsReviewing(false);
    }
  }

  if (!data) {
    return (
      <main className="loading-screen">
        <LoaderCircle className="spin" />
        <p>{error || "Opening application workspace…"}</p>
        {error && <Link href="/">Return home</Link>}
      </main>
    );
  }

  const { application, artifacts } = data;
  const displayStage =
    application.stage === "researching-company"
      ? "planning-research"
      : application.stage;
  const currentIndex = Math.max(
    STAGES.findIndex(([stage]) => stage === displayStage),
    0,
  );
  const artifactGroups = Object.entries(
    artifacts.reduce<Record<string, string[]>>((groups, artifact) => {
      (groups[artifact.kind] ??= []).push(artifact.format);
      return groups;
    }, {}),
  );

  return (
    <main>
      <header className="site-header">
        <Link className="back-link" href="/">
          <ArrowLeft size={17} /> All applications
        </Link>
        <span className={`status-pill status-${application.status}`}>
          {application.status}
        </span>
      </header>

      <section className="application-hero shell">
        <div>
          <p className="eyebrow">{application.company}</p>
          <h1>{application.job_title}</h1>
          <p className="application-meta">
            Started {new Date(application.created_at).toLocaleDateString()}
            {application.recruiter_name
              ? ` · Recruiter: ${application.recruiter_name}`
              : ""}
          </p>
        </div>
        {application.job_url && (
          <a className="secondary-button" href={application.job_url} target="_blank">
            View job posting <ArrowRightIcon />
          </a>
        )}
      </section>

      <div className="application-shell shell">
        <aside className="progress-card">
          <p className="eyebrow">Workflow</p>
          <ol className="progress-list">
            {STAGES.map(([stage, label], index) => {
              const isComplete = index < currentIndex || application.stage === "complete";
              const isCurrent = stage === displayStage;
              return (
                <li className={isCurrent ? "current" : isComplete ? "done" : ""} key={stage}>
                  <span>{isComplete ? <Check size={14} /> : index + 1}</span>
                  {label}
                </li>
              );
            })}
          </ol>

          <details className="job-details">
            <summary>Original job description</summary>
            <pre>{application.job_description}</pre>
          </details>
        </aside>

        <section className="results-column">
          {application.error && <p className="error-message">{application.error}</p>}
          {error && <p className="error-message">{error}</p>}

          {!data.fitAnalysis && application.status !== "errored" && (
            <div className="working-card">
              <div className="working-icon">
                {displayStage === "retrieving-sources" ? (
                  <Search size={24} />
                ) : (
                  <Sparkles size={24} />
                )}
              </div>
              <div>
                <p className="eyebrow">In progress</p>
                <h2>{stageLabel(displayStage)}</h2>
                <p>
                  The workflow is saving each completed step. You can leave this
                  page and return without losing progress.
                </p>
              </div>
            </div>
          )}

          {data.fitAnalysis && (
            <article className="markdown-card">
              <ReactMarkdown>{data.fitAnalysis}</ReactMarkdown>
            </article>
          )}

          {application.stage === "awaiting-review" && (
            <section className="review-card">
              <p className="eyebrow">Your checkpoint</p>
              <h2>Approve the strategy before writing</h2>
              <p>
                Correct assumptions, add missing evidence, or tell the writer
                what to emphasize. No final documents are created until you approve.
              </p>
              <textarea
                rows={6}
                value={reviewNotes}
                onChange={(event) => setReviewNotes(event.target.value)}
                placeholder="For example: emphasize product leadership; do not mention…"
              />
              <div className="review-actions">
                <button
                  className="primary-button"
                  disabled={isReviewing}
                  onClick={() => void review(true)}
                  type="button"
                >
                  {isReviewing ? <LoaderCircle className="spin" size={18} /> : <Check size={18} />}
                  Approve and create documents
                </button>
                <button
                  className="text-button"
                  disabled={isReviewing}
                  onClick={() => void review(false)}
                  type="button"
                >
                  Don&apos;t proceed
                </button>
              </div>
            </section>
          )}

          {artifactGroups.length > 0 && (
            <section className="artifact-section">
              <div className="section-heading compact">
                <div>
                  <p className="eyebrow">Files</p>
                  <h2>Application artifacts</h2>
                </div>
              </div>
              <div className="artifact-grid">
                {artifactGroups.map(([kind, formats]) => (
                  <div className="artifact-card" key={kind}>
                    <FileText size={21} />
                    <div>
                      <strong>{artifactLabel(kind)}</strong>
                      <div className="artifact-links">
                        {formats.map((format) => (
                          <a
                            href={`/api/applications/${applicationId}/artifacts/${kind}?format=${format}`}
                            key={format}
                          >
                            <Download size={13} /> {format.toUpperCase()}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </section>
      </div>
    </main>
  );
}

function stageLabel(stage: string): string {
  return STAGES.find(([value]) => value === stage)?.[1] || "Preparing your application";
}

function artifactLabel(kind: string): string {
  if (kind.startsWith("research-source-")) {
    return `Research source ${Number(kind.slice(-2))}`;
  }
  return LABELS[kind] || kind;
}

function ArrowRightIcon() {
  return <span aria-hidden="true">↗</span>;
}

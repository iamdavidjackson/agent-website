"use client";

import { ArrowRight, BriefcaseBusiness, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

type ApplicationSummary = {
  id: string;
  company: string;
  job_title: string;
  status: string;
  stage: string;
  created_at: string;
};

const initialForm = {
  company: "",
  jobTitle: "",
  jobUrl: "",
  recruiterName: "",
  jobDescription: "",
  notes: "",
};

export function ApplicationDashboard() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [applications, setApplications] = useState<ApplicationSummary[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    fetch("/api/applications", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Could not load past applications.");
        return response.json() as Promise<{ applications: ApplicationSummary[] }>;
      })
      .then((data) => setApplications(data.applications ?? []))
      .catch((caught) => setError((caught as Error).message))
      .finally(() => setIsLoading(false));
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(undefined);
    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = (await response.json()) as { error?: string; id?: string };
      if (!response.ok) throw new Error(result.error || "Unable to start application.");
      if (!result.id) throw new Error("The application was created without an ID.");
      router.push(`/applications/${result.id}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to start application.");
      setIsSubmitting(false);
    }
  }

  return (
    <section className="workspace shell">
      <form className="intake-card" onSubmit={submit}>
        <div className="section-heading">
          <div>
            <p className="eyebrow">New application</p>
            <h2>Tell me about the opportunity</h2>
          </div>
          <span className="step-number">01</span>
        </div>

        <div className="field-grid">
          <label>
            Company
            <input
              required
              value={form.company}
              onChange={(event) => setForm({ ...form, company: event.target.value })}
              placeholder="Company name"
            />
          </label>
          <label>
            Job title
            <input
              required
              value={form.jobTitle}
              onChange={(event) => setForm({ ...form, jobTitle: event.target.value })}
              placeholder="Senior Product Engineer"
            />
          </label>
          <label>
            Job URL
            <input
              type="url"
              value={form.jobUrl}
              onChange={(event) => setForm({ ...form, jobUrl: event.target.value })}
              placeholder="https://…"
            />
          </label>
          <label>
            Recruiter
            <input
              value={form.recruiterName}
              onChange={(event) =>
                setForm({ ...form, recruiterName: event.target.value })
              }
              placeholder="Optional"
            />
          </label>
        </div>

        <label>
          Job description
          <textarea
            required
            minLength={100}
            rows={14}
            value={form.jobDescription}
            onChange={(event) =>
              setForm({ ...form, jobDescription: event.target.value })
            }
            placeholder="Paste the complete job description…"
          />
        </label>

        <label>
          Positioning notes
          <textarea
            rows={4}
            value={form.notes}
            onChange={(event) => setForm({ ...form, notes: event.target.value })}
            placeholder="Anything to emphasize, avoid, or investigate…"
          />
        </label>

        {error && <p className="error-message">{error}</p>}

        <button className="primary-button" disabled={isSubmitting} type="submit">
          {isSubmitting ? (
            <>
              <LoaderCircle className="spin" size={18} /> Starting research
            </>
          ) : (
            <>
              Research this role <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      <aside className="application-list">
        <div className="section-heading compact">
          <div>
            <p className="eyebrow">History</p>
            <h2>Applications</h2>
          </div>
        </div>

        {isLoading ? (
          <p className="muted-row"><LoaderCircle className="spin" size={17} /> Loading</p>
        ) : applications.length ? (
          <div className="application-links">
            {applications.map((application) => (
              <Link href={`/applications/${application.id}`} key={application.id}>
                <span className="list-icon"><BriefcaseBusiness size={18} /></span>
                <span className="list-main">
                  <strong>{application.company}</strong>
                  <small>{application.job_title}</small>
                </span>
                <span className={`status-dot status-${application.status}`} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-list">
            <BriefcaseBusiness size={24} />
            <p>Your researched applications will appear here.</p>
          </div>
        )}
      </aside>
    </section>
  );
}

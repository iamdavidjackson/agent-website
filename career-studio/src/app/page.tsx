import { ApplicationDashboard } from "@/components/application-dashboard";

export default function HomePage() {
  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="/">
          Career Studio
        </a>
        <span className="private-badge">Private workspace</span>
      </header>

      <section className="hero shell">
        <div>
          <p className="eyebrow">Application intelligence</p>
          <h1>Start with the role. Build from the evidence.</h1>
        </div>
        <p className="hero-copy">
          Research the company, test the fit, review the evidence, then create a
          truthful resume, cover letter, and interview plan from one approved
          application brief.
        </p>
      </section>

      <ApplicationDashboard />
    </main>
  );
}

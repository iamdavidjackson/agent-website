import { marked } from "marked";
import type { ApplicationBrief, ApplicationInput, JobAnalysis } from "./types";

const DEFAULT_AGENT_URL = "https://iamdavidjackson.com/agent";

function bulletList(items: string[]): string {
  return items.length
    ? items.map((item) => `- ${item}`).join("\n")
    : "- None identified.";
}

export function renderFitAnalysis(
  input: ApplicationInput,
  analysis: JobAnalysis,
  brief: ApplicationBrief,
  research: {
    markdown: string;
    sources: Array<{ title: string; url: string }>;
  },
): string {
  const fit = brief.fitAssessment
    .map((item) => `| ${item.dimension} | ${item.rating} | ${item.rationale} |`)
    .join("\n");
  const evidence = brief.evidenceMatches
    .map(
      (item) =>
        `| ${item.requirement} | ${item.strength} | ${item.evidenceIds.join(", ") || "None"} | ${item.rationale} |`,
    )
    .join("\n");
  const gaps = brief.gaps
    .map((gap) => `- **${gap.area}** (${gap.type}): ${gap.action}`)
    .join("\n");
  const sources = research.sources
    .map((source) => `- [${source.title}](${source.url})`)
    .join("\n");

  return `# Fit analysis: ${input.jobTitle} at ${input.company}

## Recommendation

**${brief.recommendation.replaceAll("-", " ")}**

${brief.executiveSummary}

## Role summary

${analysis.roleSummary}

Seniority: ${analysis.seniority}

## Fit scorecard

| Dimension | Rating | Rationale |
| --- | --- | --- |
${fit}

## Requirement evidence

| Requirement | Match | Evidence | Rationale |
| --- | --- | --- | --- |
${evidence}

## Gaps and open questions

${gaps || "- None identified."}

## Research and improvement plan

${bulletList(brief.researchAndImprovement)}

## Recommended positioning

${bulletList(brief.positioning)}

## Company research

${research.markdown}

## Sources

${sources || "- No external sources were returned."}
`;
}

export function addAgentLinkToResume(
  markdown: string,
  applicationId: string,
  agentBaseUrl = DEFAULT_AGENT_URL,
): string {
  const url = new URL(agentBaseUrl);
  url.searchParams.set("jobId", applicationId);
  const link = url.toString();

  if (markdown.includes(link)) return markdown;

  return `${markdown.trimEnd()}\n\n---\n\n[Ask David's AI portfolio assistant about this role](${link})\n`;
}

export function markdownDocumentHtml(markdown: string, title: string): string {
  const body = String(marked.parse(markdown));
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <style>
    @page { size: letter; margin: 0.55in 0.65in; }
    * { box-sizing: border-box; }
    body { margin: 0; color: #18181b; font: 10.25pt/1.4 Arial, Helvetica, sans-serif; }
    h1 { margin: 0 0 8px; font-size: 22pt; line-height: 1.1; letter-spacing: -0.02em; }
    h2 { margin: 16px 0 6px; padding-bottom: 3px; border-bottom: 1px solid #d4d4d8; font-size: 11.5pt; text-transform: uppercase; letter-spacing: 0.08em; }
    h3 { margin: 10px 0 3px; font-size: 10.5pt; }
    p { margin: 0 0 7px; }
    ul { margin: 4px 0 8px; padding-left: 18px; }
    li { margin: 0 0 3px; }
    a { color: inherit; text-decoration: none; }
    strong { font-weight: 700; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 5px; border: 1px solid #d4d4d8; text-align: left; vertical-align: top; }
  </style>
</head>
<body>${body}</body>
</html>`;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

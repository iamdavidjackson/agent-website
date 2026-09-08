# Career Studio

A private job-application workspace that researches a company, evaluates role
fit against David's shared Markdown evidence, pauses for human review, and then
creates a resume, cover letter, and interview preparation kit.

## Workflow

1. Parse the supplied job description into structured requirements.
2. Research the company and role using Claude's cited web-search tool.
3. Retrieve the most relevant evidence from `../content/knowledge-base`.
4. Create and save a candid fit analysis and application brief.
5. Wait for David to approve or reject the strategy for up to 30 days.
6. Generate and validate the final Markdown documents.
7. Render the resume and cover letter as accessible PDFs.

Every generated resume includes a link to
`https://iamdavidjackson.com/agent?jobId=<application UUID>`. The website Worker
uses that UUID to read the completed application from D1 and its tailored
resume from R2.

The workflow will not invent metrics, titles, dates, technologies, or outcomes.
Missing information is treated as missing evidence rather than proof of a gap.

## Architecture

- Next.js and OpenNext on Cloudflare Workers
- Cloudflare Workflows for durable execution and the review checkpoint
- D1 for application status and artifact metadata
- R2 for Markdown, JSON, and PDF artifacts
- Browser Run for deterministic HTML-to-PDF rendering
- Anthropic Messages API for structured analysis, web research, and writing

The custom Worker entrypoint reuses OpenNext's generated fetch handler and
exports `CareerApplicationWorkflow`, so the application deploys as one Worker.

## Local development

Install dependencies and bundle the shared content:

```bash
npm install
npm run content:build
```

Create the local variables file:

```bash
cp .dev.vars.example .dev.vars
```

Add an Anthropic API key, then initialize local D1:

```bash
npm run db:migrate:local
```

Use the OpenNext preview for Workflow and Cloudflare binding support:

```bash
npm run preview
```

The application is available at `http://localhost:8787`. Browser Run Quick
Actions require a remote binding, so local workflows can be tested through the
review checkpoint but PDF rendering should be verified after deployment.

## Cloudflare resources

The D1 database has been created and its migration applied:

```text
database: career-studio
id: 352e7401-065e-43a7-bb91-e189412da43d
```

R2 must be enabled once from the Cloudflare dashboard. After enabling it, create
the configured bucket:

```bash
npx wrangler r2 bucket create career-studio-artifacts
```

Add secrets and production configuration:

```bash
npx wrangler secret put ANTHROPIC_API_KEY
npx wrangler secret put CAREER_STUDIO_ACCESS_EMAIL
```

`ANTHROPIC_MODEL` is optional and defaults to `claude-sonnet-4-6`.

## Private access

The production route is `career.iamdavidjackson.com/*`, and `workers.dev` is
disabled to avoid an unprotected alternate hostname. Before deploying:

1. Create a proxied DNS record for `career.iamdavidjackson.com`.
2. Create a Cloudflare Access self-hosted application for that hostname.
3. Add an Allow policy limited to David's email address.
4. Store that same email in `CAREER_STUDIO_ACCESS_EMAIL`.

The Worker fails closed outside local development: it requires both Cloudflare
Access's JWT assertion header and the matching authenticated-email header.

## Deployment

After R2 and Access are configured:

```bash
npm run db:migrate:remote
npm run deploy
```

The production build runs the shared-content generator automatically. New or
updated Markdown evidence is included on the next deployment.

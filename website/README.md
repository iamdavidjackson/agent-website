# iamdavidjackson.com

David Jackson's website and portfolio assistant. The complete application runs
as one Next.js service on Cloudflare Workers through the OpenNext adapter.

## Local development

Install dependencies and create the local Cloudflare variables file:

```bash
npm install
cp .dev.vars.example .dev.vars
```

Add an Anthropic API key to `.dev.vars`, then start Next.js:

```bash
npm run dev
```

The website is available at `http://localhost:3000`; the chat interface is at
`http://localhost:3000/agent`.

The build automatically bundles the shared Markdown files under
`../content/knowledge-base` and `../content/jobs`. Run
`npm run content:build` after changing that content if you need to inspect the
generated JSON without performing a full build.

## Cloudflare deployment

Authenticate Wrangler and add the production secret once:

```bash
npx wrangler login
npx wrangler secret put ANTHROPIC_API_KEY
```

Optionally override the default Anthropic model:

```bash
npx wrangler secret put ANTHROPIC_MODEL
```

Build and test in the Cloudflare Workers runtime:

```bash
npm run preview
```

Deploy the Worker:

```bash
npm run deploy
```

The default deployment is available at
`https://agent-website.davidjackson123.workers.dev`.

### Custom domain

`iamdavidjackson.com` is attached to the Worker with a zone route. The imported
GitHub Pages DNS record remains as an unused fallback origin:

```toml
[[routes]]
pattern = "iamdavidjackson.com/*"
zone_id = "44ae18acfa98783d56ef4f7d0b1ed807"
```

For Git-based Cloudflare deployments, use `website` as the application root and
`npm run deploy` as the deploy command. The Worker name is `agent-website`.

`/api/chat` uses a Cloudflare Rate Limiting binding to allow ten requests per
minute per visitor before invoking the paid model. Keep `ANTHROPIC_API_KEY`
server-side; never create a `NEXT_PUBLIC_` version of it.

# Knowledge Base Content

This folder contains markdown-based source records for the personal knowledge base.

## Structure

- `work-history/` - one file per role
- `profile/` - canonical contact details and professional positioning
- `education/` - one file per program
- `education/courses/` - one file per course
- `interests/` - one file per interest
- `faqs/` - one file per frequently asked question

## Record Pattern

Each record uses:

1. YAML front matter for structured metadata
2. Markdown headings for rich narrative fields

## Build Convention

Running `npm run content:build` from `website/` reads these files, splits their
Markdown sections, and writes the bundled data to
`website/src/generated/agent-content.json` for the chat API. The source files
use:

- front matter contains scalar fields, dates, arrays, and identity metadata
- markdown body sections are mapped by heading name
- list sections map to arrays of strings
- prose sections map to strings
- related records are linked by IDs in front matter and resolved by the parser

## Content Coverage

The files in this folder cover:

- front matter parsing
- markdown section parsing
- list extraction
- related records such as education programs and course files
- retrieval context used by the production agent

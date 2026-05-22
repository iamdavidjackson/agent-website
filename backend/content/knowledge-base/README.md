# Knowledge Base Content

This folder contains markdown-based source records for the personal knowledge base.

## Structure

- `work-history/` - one file per role
- `education/` - one file per program
- `education/courses/` - one file per course
- `interests/` - one file per interest
- `faqs/` - one file per frequently asked question

## Record Pattern

Each record uses:

1. YAML front matter for structured metadata
2. Markdown headings for rich narrative fields

## Parsing Convention

For the initial parser, assume:

- front matter contains scalar fields, dates, arrays, and identity metadata
- markdown body sections are mapped by heading name
- list sections map to arrays of strings
- prose sections map to strings
- related records are linked by IDs in front matter and resolved by the parser

## Current Mock Data

The files in this folder are fixtures for Story 1.1 development. They are intentionally realistic enough to test:

- front matter parsing
- markdown section parsing
- list extraction
- related records such as education programs and course files
- later RAG chunking experiments

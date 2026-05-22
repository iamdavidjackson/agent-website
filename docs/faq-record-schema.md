# FAQ Record Schema

## Purpose

This document defines the initial shape of a frequently asked question record for the knowledge base. The goal is to capture reusable question-and-answer pairs that can support recruiter conversations, cover-letter drafting, and future chat-agent grounding.

## Recommended Record Shape

Each FAQ record should contain:

- `question`
  - The question David expects to be asked frequently.
  - Example: `What kind of roles are you most interested in right now?`

- `answer`
  - A prepared answer that reflects David's actual perspective and can be reused or adapted later.

- `links`
  - A list of URLs or references associated with the answer.
  - Can be used for supporting materials, portfolio items, articles, case studies, or related resources.
  - Best stored as an array of strings for MVP.

## Suggested MVP Data Model

```ts
type FaqRecord = {
  id: string;
  question: string;
  answer: string;
  links: string[];
  archived: boolean;
  createdAt: string;
  updatedAt: string;
};
```

## Design Notes

- `question` and `answer` are the core fields and should stay simple.
- FAQ records are likely to become especially useful in a future recruiter-chat phase, but they are still valuable now as reusable source material.
- `links` gives us a lightweight way to attach evidence or supporting references without designing a richer citation model yet.

## Recommended Next Build Scope

For the first implementation pass, the editor should support:

- Creating an FAQ record
- Editing an FAQ record
- Listing saved FAQ records
- Marking an FAQ record as archived

The first UI can treat `links` as newline-separated inputs that map to an array on save.

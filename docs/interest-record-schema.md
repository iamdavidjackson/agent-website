# Interest Record Schema

## Purpose

This document defines the initial shape of an interest record for the knowledge base. The goal is to capture personal and professional interests in a way that supports richer recruiter conversations, better cover-letter personalization, and later interview-prep workflows.

## Recommended Record Shape

Each interest record should contain:

- `interestName`
  - The name of the interest.
  - Example: `Photography`

- `description`
  - A short summary of what the interest is in practice for David.
  - This should describe the interest itself, not just why it matters.

- `whyItIsInteresting`
  - A short explanation of what makes the interest meaningful, exciting, or compelling.

- `howOrWhyDidYouStart`
  - The origin story for the interest.
  - This can capture how David got into it, what sparked it, or what made it stick.

- `whatWouldYouLoveToDoWithIt`
  - A future-facing aspiration tied to the interest.
  - This is useful for storytelling, interviews, and more human application materials.

- `links`
  - A list of URLs or references associated with the interest.
  - Can be used for articles, communities, portfolios, events, videos, projects, or related material.
  - Best stored as an array of strings for MVP.

## Suggested MVP Data Model

```ts
type InterestRecord = {
  id: string;
  interestName: string;
  description: string;
  whyItIsInteresting: string;
  howOrWhyDidYouStart: string;
  whatWouldYouLoveToDoWithIt: string;
  links: string[];
  archived: boolean;
  createdAt: string;
  updatedAt: string;
};
```

## Design Notes

- `interestName` and `description` are the minimum useful fields.
- `whyItIsInteresting` and `howOrWhyDidYouStart` help preserve authentic voice and story, which is valuable for cover letters and interviews.
- `whatWouldYouLoveToDoWithIt` gives the system a way to express future-facing ambition and curiosity.
- `links` gives us a lightweight way to attach supporting references without requiring a richer media model yet.

## Recommended Next Build Scope

For the first implementation pass, the editor should support:

- Creating an interest record
- Editing an interest record
- Listing saved interest records
- Marking an interest record as archived

The first UI can treat `links` as newline-separated inputs that map to an array on save.

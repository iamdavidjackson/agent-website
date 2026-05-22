# Work History Record Schema

## Purpose

This document defines the initial shape of a single work history record for Story 1.1. The goal is to capture enough structure for editing, resume generation, job-listing matching, and later interview-prep workflows without overcomplicating the first version.

Story 1.1 currently includes two primary record families:

- Work history records, defined in this document
- Education records, defined in [education-record-schema.md](/Users/davjacks/Sites/iamdavidjackson.com/docs/education-record-schema.md:1)
- Interest records, defined in [interest-record-schema.md](/Users/davjacks/Sites/iamdavidjackson.com/docs/interest-record-schema.md:1)
- FAQ records, defined in [faq-record-schema.md](/Users/davjacks/Sites/iamdavidjackson.com/docs/faq-record-schema.md:1)

## Recommended Record Shape

Each work history record should contain:

- `title`
  - The role title held during the engagement.
  - Example: `Senior Software Engineer`

- `company`
  - The employer, agency, consultancy, or organization name.
  - Example: `Acme Corp`

- `startDate`
  - The date the role started.
  - Store in ISO-like format where possible, such as `YYYY-MM` or `YYYY-MM-DD`.

- `endDate`
  - The date the role ended.
  - Can be empty or `null` for current roles.

- `responsibilities`
  - A list of recurring duties or ownership areas.
  - Best stored as an array of strings.

- `clients`
  - A list of clients supported during the role, if applicable.
  - Best stored as an array of strings.
  - This should remain optional because not every role is client-facing.

- `technologies`
  - A list of tools, platforms, languages, frameworks, or systems used in the role.
  - Best stored as an array of strings.

- `projects`
  - A list of meaningful project summaries associated with the role.
  - For MVP, each project can be a short text entry.
  - Later this can become a richer nested structure.

- `links`
  - A list of URLs or references associated with the role.
  - Can be used for portfolio items, case studies, employer pages, demos, articles, repositories, or other supporting material.
  - Best stored as an array of strings for MVP.

- `feedbackRecognition`
  - Positive feedback, testimonials, praise, recognition, or notable endorsements connected to the role.
  - Best stored as an array of strings.

- `awards`
  - Formal awards, distinctions, or special acknowledgements earned in the role.
  - Best stored as an array of strings.

- `lessonsLearned`
  - A list of reflections, insights, or takeaways from the role.
  - Best stored as an array of strings.

- `successes`
  - Specific wins, outcomes, improvements, or achievements from the role.
  - Best stored as an array of strings.

- `failures`
  - Setbacks, mistakes, or initiatives that did not go as planned, captured in a constructive way.
  - Best stored as an array of strings.

## Suggested MVP Data Model

```ts
type WorkHistoryRecord = {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string | null;
  responsibilities: string[];
  clients: string[];
  technologies: string[];
  projects: string[];
  links: string[];
  feedbackRecognition: string[];
  awards: string[];
  lessonsLearned: string[];
  successes: string[];
  failures: string[];
  archived: boolean;
  createdAt: string;
  updatedAt: string;
};
```

## Design Notes

- `responsibilities`, `technologies`, `successes`, and `projects` are likely the most important fields for resume generation.
- `links` is useful for later portfolio-style presentation, evidence tracking, and document traceability.
- `lessonsLearned` and `failures` are especially useful later for interview prep, but they are still worth capturing now.
- `clients`, `awards`, and `feedbackRecognition` should be optional in the UI because many roles will not use them.
- `projects` should eventually become structured child records, but plain strings are enough for Story 1.1.
- We should likely add a top-level `summary` field later if we want a short narrative for each role, but it is not required to begin.

## Recommended Next Build Scope

For the first implementation pass of Story 1.1, the editor should support:

- Creating a work history record
- Editing a work history record
- Listing saved work history records
- Marking a record as archived

The first UI can treat most list-like fields as newline-separated inputs that map to arrays on save.

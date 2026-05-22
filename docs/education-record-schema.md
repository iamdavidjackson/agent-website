# Education Record Schema

## Purpose

This document defines the initial shape of education records for Story 1.1. The goal is to capture formal education in a way that supports editing, resume generation, job-match analysis, and later interview-prep or knowledge-base expansion.

## Recommended Education Record Shape

Each education record should contain:

- `program`
  - The name of the degree, diploma, certificate, bootcamp, or program.
  - Example: `Bachelor of Computer Science`

- `institution`
  - The school, university, college, academy, or provider name.
  - Example: `University of Toronto`

- `startDate`
  - The date the program started.
  - Store in ISO-like format where possible, such as `YYYY-MM` or `YYYY-MM-DD`.

- `endDate`
  - The date the program ended.
  - Can be empty or `null` for ongoing study.

- `skills`
  - A list of capabilities, methods, or competencies developed through the program.
  - Best stored as an array of strings.

- `description`
  - A short narrative summary of the program and what it focused on.

- `comments`
  - Additional notes, reflections, context, or things David wants to remember about the program.

- `links`
  - A list of URLs or references associated with the program.
  - Can be used for institution pages, credential verification, program descriptions, syllabi, or supporting materials.
  - Best stored as an array of strings for MVP.

- `courses`
  - An optional list of courses attached to the program at the normalized application layer.
  - In markdown storage, this is assembled by the parser from linked course files.

- `courseIds`
  - A list of related course IDs stored on the program record when using markdown source files.
  - Best stored as an array of strings in front matter.

## Recommended Course Shape

Each course record should contain:

- `course`
  - The course name.
  - Example: `Distributed Systems`

- `year`
  - The year the course was taken.
  - Example: `2022`

- `skills`
  - A list of capabilities or practices learned through the course.
  - Best stored as an array of strings.

- `topics`
  - A list of notable topics covered in the course.
  - Best stored as an array of strings.

- `synopsis`
  - A short summary of the course content or why it mattered.

- `comments`
  - Additional notes, reflections, or context David wants to preserve.

- `links`
  - A list of URLs or references associated with the course.
  - Can be used for course descriptions, project pages, reading lists, certificates, or related material.
  - Best stored as an array of strings for MVP.

## Suggested MVP Data Model

```ts
type EducationCourseRecord = {
  id: string;
  programId: string;
  course: string;
  year: string;
  skills: string[];
  topics: string[];
  synopsis: string;
  comments: string;
  links: string[];
};

type EducationRecord = {
  id: string;
  program: string;
  institution: string;
  startDate: string;
  endDate: string | null;
  skills: string[];
  description: string;
  comments: string;
  links: string[];
  courseIds?: string[];
  courses: EducationCourseRecord[];
  archived: boolean;
  createdAt: string;
  updatedAt: string;
};
```

## Markdown Storage Convention

When education data is stored as markdown files:

- each program lives in its own markdown file
- each course lives in its own markdown file
- the program file stores `courseIds`
- the course file stores `programId`

The parser is responsible for resolving those linked markdown records into the normalized `courses: EducationCourseRecord[]` field used by the TypeScript app model.

## Design Notes

- `program`, `institution`, `startDate`, and `endDate` are the minimum useful core fields.
- `skills` is especially important because education often contributes directly to keyword and fit analysis for job listings.
- `description` helps preserve the narrative meaning of the program in a way that raw structured fields cannot.
- `comments` is useful for internal memory even when the content should not appear in outward-facing materials.
- `links` gives us a lightweight way to attach external evidence and references without designing a richer asset model yet.
- `courses` should be optional because many education entries will not need that level of detail.
- Courses are normalized as nested runtime data, but stored as standalone markdown source records so they are easier to author, link, and chunk for retrieval.

## Recommended Next Build Scope

For the first implementation pass of Story 1.1, the editor should support:

- Creating an education record
- Editing an education record
- Listing saved education records
- Marking an education record as archived
- Adding and editing optional course entries linked to a program

The first UI can treat list-like fields such as `skills` and `topics` as newline-separated inputs that map to arrays on save.

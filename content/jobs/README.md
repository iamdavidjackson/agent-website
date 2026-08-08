# Jobs

Store application-specific job context here as markdown. Each job should use a stable id and live at:

```text
content/jobs/<job-id>.md
```

Open the website with `/agent?jobId=<job-id>`. The build bundles the matching
file and the chat API includes it as system context for the agent.

Use this standard shape:

```markdown
---
id: example-job
company_name: Example Company
recruiter_name: Recruiter Name
links:
  - https://example.com/job
---

# Job Description

...

# Resume

...

# Questions

...

# Notes

...
```

## Field Usage

- `id`: Stable application identifier. It maps the URL `jobId` to this file and should not normally be mentioned to visitors.
- `company_name`: The company David applied to. The agent should tailor answers to this company when relevant.
- `recruiter_name`: The recruiter or contact. The agent should use this for drafted outreach or contact-specific context, not as a default salutation.
- `Job Description`: The target role requirements, responsibilities, and language. The agent should use this to frame David's background around the role's actual needs.
- `Resume`: The resume version used for the application. The agent should treat this as the primary evidence for job-specific answers.
- `links`: Relevant job, company, or application links. The agent should reference these when discussing the role or company context.
- `Questions`: Likely recruiter or interview questions. The agent should answer these by connecting job requirements to resume-backed examples.
- `Notes`: Steering notes about positioning, emphasis, concerns, or follow-up. The agent should use these to shape responses without exposing them as notes unless asked.

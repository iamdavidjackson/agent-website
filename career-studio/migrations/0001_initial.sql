CREATE TABLE IF NOT EXISTS applications (
  id TEXT PRIMARY KEY,
  company TEXT NOT NULL,
  job_title TEXT NOT NULL,
  job_url TEXT,
  recruiter_name TEXT,
  job_description TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'queued',
  stage TEXT NOT NULL DEFAULT 'intake',
  workflow_id TEXT NOT NULL,
  error TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS artifacts (
  id TEXT PRIMARY KEY,
  application_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  format TEXT NOT NULL,
  r2_key TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
  UNIQUE(application_id, kind, format)
);

CREATE INDEX IF NOT EXISTS artifacts_application_id_idx
  ON artifacts(application_id);

CREATE INDEX IF NOT EXISTS applications_created_at_idx
  ON applications(created_at DESC);

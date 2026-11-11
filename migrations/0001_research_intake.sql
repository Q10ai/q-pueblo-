-- Q-Pueblo D1 candidate; requires authorized Cloudflare binding QP_DB.
-- No email, IP, user profiles, private attachments, child data or AI model outputs stored.
CREATE TABLE IF NOT EXISTS research_cases (
  id TEXT PRIMARY KEY,
  receipt_sha256 TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('question','correction','public_source')),
  question TEXT NOT NULL,
  public_source_url TEXT,
  state TEXT NOT NULL CHECK (state IN ('unverified_lead','triage','researching','human_review','approved_for_release','rejected')),
  revision INTEGER NOT NULL DEFAULT 0 CHECK (revision>=0),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS research_events (
  event_id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES research_cases(id) ON DELETE CASCADE,
  revision INTEGER NOT NULL,
  state TEXT NOT NULL,
  reviewer TEXT NOT NULL,
  reason TEXT NOT NULL,
  verified_source_url TEXT,
  counter_source_url TEXT,
  at TEXT NOT NULL,
  UNIQUE(case_id,revision)
);
CREATE INDEX IF NOT EXISTS idx_research_cases_state ON research_cases(state,created_at);
CREATE INDEX IF NOT EXISTS idx_research_events_case ON research_events(case_id,revision);

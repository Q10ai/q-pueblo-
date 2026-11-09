-- Deploy only after legal/privacy review; no public query permissions or unmoderated publication.
CREATE TABLE IF NOT EXISTS q_observations (
 id TEXT PRIMARY KEY, created_at TEXT NOT NULL, kind TEXT NOT NULL,
 statement TEXT NOT NULL, issue_id TEXT, source_url TEXT,
 status TEXT NOT NULL DEFAULT 'quarantined' CHECK (status IN ('quarantined','under_review','rejected','accepted'))
);
CREATE INDEX IF NOT EXISTS q_obs_status_time ON q_observations(status,created_at);

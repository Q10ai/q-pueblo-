-- Run once in the bound QP_USAGE_DB D1 database; never place credentials here.
-- The endpoint does not create tables or automatically grant itself permissions.
CREATE TABLE IF NOT EXISTS qp_api_quota (
  id TEXT PRIMARY KEY,
  day_utc TEXT NOT NULL,
  month_utc TEXT NOT NULL,
  day_attempts INTEGER NOT NULL DEFAULT 0 CHECK(day_attempts >= 0),
  month_attempts INTEGER NOT NULL DEFAULT 0 CHECK(month_attempts >= 0)
);

-- v0.2 single-use approval ledger. Use only a newly provisioned preview database.
-- If earlier quota counters exist, STOP and reconcile before cutover; do not reset spent allowances.
CREATE TABLE IF NOT EXISTS qp_api_attempts (
  approval_digest TEXT PRIMARY KEY CHECK(length(approval_digest) = 64),
  day_utc TEXT NOT NULL,
  month_utc TEXT NOT NULL CHECK(month_utc = substr(day_utc,1,7))
);
CREATE INDEX IF NOT EXISTS qp_attempt_day ON qp_api_attempts(day_utc);
CREATE INDEX IF NOT EXISTS qp_attempt_month ON qp_api_attempts(month_utc);
-- Keep digest receipts across periods; no automatic deletion or reapproval.

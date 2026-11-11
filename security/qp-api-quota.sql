-- Run once in the bound QP_USAGE_DB D1 database; never place credentials here.
-- The endpoint does not create tables or automatically grant itself permissions.
CREATE TABLE IF NOT EXISTS qp_api_quota (
  id TEXT PRIMARY KEY,
  day_utc TEXT NOT NULL,
  month_utc TEXT NOT NULL,
  day_attempts INTEGER NOT NULL DEFAULT 0 CHECK(day_attempts >= 0),
  month_attempts INTEGER NOT NULL DEFAULT 0 CHECK(month_attempts >= 0)
);

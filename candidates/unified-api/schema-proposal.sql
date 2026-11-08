-- Q-Pueblo: SCHEMA PROPOSAL ONLY. Do not run against a production database.
-- Any later D1 migration must be reconciled with the unavailable hardened release candidate.
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS qp_sources (
  source_id TEXT PRIMARY KEY, publisher TEXT NOT NULL, canonical_url TEXT,
  source_kind TEXT NOT NULL, sha256 TEXT NOT NULL CHECK(length(sha256)=64),
  license_review TEXT NOT NULL, security_class TEXT NOT NULL CHECK(security_class IN ('S0','S1','S2','S3','S4')),
  event_at TEXT, published_at TEXT, observed_at TEXT, indexed_at TEXT,
  valid_from TEXT, valid_to TEXT, recorded_at TEXT NOT NULL,
  approval_ref TEXT, supersedes_id TEXT, retention_policy TEXT
);
CREATE TABLE IF NOT EXISTS qp_public_approvals (
  approval_id TEXT PRIMARY KEY, record_type TEXT NOT NULL, record_id TEXT NOT NULL,
  reviewer_id TEXT NOT NULL, human_authority_ref TEXT NOT NULL,
  approved_at TEXT NOT NULL, expires_at TEXT NOT NULL,
  scope TEXT NOT NULL CHECK(scope IN ('RESEARCH_ONLY','APPROVED_PUBLIC','REVOKED')),
  source_receipt_sha256 TEXT NOT NULL CHECK(length(source_receipt_sha256)=64),
  child_impact_ref TEXT NOT NULL, audit_ref TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS qp_child_impact (
  child_id TEXT PRIMARY KEY, record_id TEXT NOT NULL,
  past_statement TEXT NOT NULL, present_statement TEXT NOT NULL, future_statement TEXT NOT NULL,
  affected_groups_json TEXT NOT NULL, review_status TEXT NOT NULL,
  reviewer_id TEXT, reviewed_at TEXT, review_ttl TEXT, mitigation_json TEXT NOT NULL,
  appeal_path TEXT, repair_path TEXT, shutdown_path TEXT
);
CREATE TABLE IF NOT EXISTS qp_claims (
  claim_id TEXT PRIMARY KEY, subject_id TEXT NOT NULL, statement TEXT NOT NULL,
  kind TEXT NOT NULL CHECK(kind IN ('FACT_ASSERTION','ATTRIBUTED_VIEW','INFERENCE','HYPOTHESIS')),
  evidence_status TEXT NOT NULL, valid_from TEXT, valid_to TEXT, recorded_at TEXT NOT NULL,
  source_id TEXT NOT NULL REFERENCES qp_sources(source_id),
  contradiction_group TEXT, supersedes_id TEXT, approval_ref TEXT
);
CREATE TABLE IF NOT EXISTS qp_entities (
  entity_id TEXT PRIMARY KEY, entity_type TEXT NOT NULL, public_name TEXT NOT NULL,
  aliases_json TEXT NOT NULL, jurisdiction TEXT, valid_from TEXT, valid_to TEXT,
  source_id TEXT NOT NULL REFERENCES qp_sources(source_id), approval_ref TEXT
);
CREATE TABLE IF NOT EXISTS qp_issues (
  issue_id TEXT PRIMARY KEY, title TEXT NOT NULL, summary TEXT,
  state TEXT NOT NULL, valid_from TEXT, valid_to TEXT,
  source_id TEXT NOT NULL REFERENCES qp_sources(source_id),
  child_impact_ref TEXT NOT NULL REFERENCES qp_child_impact(child_id), approval_ref TEXT
);
CREATE TABLE IF NOT EXISTS qp_edges (
  edge_id TEXT PRIMARY KEY, from_id TEXT NOT NULL REFERENCES qp_entities(entity_id),
  to_id TEXT NOT NULL REFERENCES qp_entities(entity_id),
  relation_type TEXT NOT NULL, source_id TEXT NOT NULL REFERENCES qp_sources(source_id),
  valid_from TEXT, valid_to TEXT, recorded_at TEXT NOT NULL,
  approval_ref TEXT, CHECK(from_id <> to_id)
);
CREATE TABLE IF NOT EXISTS qp_money (
  money_id TEXT PRIMARY KEY, issue_id TEXT NOT NULL REFERENCES qp_issues(issue_id),
  stage TEXT NOT NULL CHECK(stage IN ('REQUESTED','PROPOSED','VOTER_AUTHORIZED','APPROPRIATED','CONTRACTED','OBLIGATED','INVOICED','PAID','RECOVERED','MEASURED_OUTCOME')),
  amount_minor_units INTEGER, currency TEXT NOT NULL, fiscal_period TEXT NOT NULL,
  payer_entity_id TEXT, recipient_entity_id TEXT, no_double_count_group TEXT NOT NULL,
  source_id TEXT NOT NULL REFERENCES qp_sources(source_id), approval_ref TEXT
);
CREATE TABLE IF NOT EXISTS qp_aggregated_features (
  feature_id TEXT PRIMARY KEY, layer TEXT NOT NULL, area_label TEXT NOT NULL,
  precision_class TEXT NOT NULL CHECK(precision_class = 'AGGREGATED'),
  valid_from TEXT, valid_to TEXT, source_id TEXT NOT NULL REFERENCES qp_sources(source_id),
  approval_ref TEXT
);
CREATE TABLE IF NOT EXISTS qp_scenarios (
  scenario_id TEXT PRIMARY KEY, issue_id TEXT NOT NULL REFERENCES qp_issues(issue_id),
  baseline_snapshot_id TEXT NOT NULL, assumptions_json TEXT NOT NULL,
  intervention_branches_json TEXT NOT NULL, output_bounds_json TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('HYPOTHETICAL','RETIRED')),
  child_impact_ref TEXT NOT NULL REFERENCES qp_child_impact(child_id),
  source_id TEXT NOT NULL REFERENCES qp_sources(source_id), approval_ref TEXT
);
CREATE TABLE IF NOT EXISTS qp_perspectives (
  perspective_id TEXT PRIMARY KEY, issue_id TEXT NOT NULL REFERENCES qp_issues(issue_id),
  lens_label TEXT NOT NULL, view_kind TEXT NOT NULL,
  attributed_source_id TEXT, hypothesis_note TEXT,
  valid_from TEXT, valid_to TEXT, recorded_at TEXT NOT NULL,
  child_impact_ref TEXT NOT NULL REFERENCES qp_child_impact(child_id),
  approval_ref TEXT
);
CREATE TABLE IF NOT EXISTS qp_audit (
  audit_id TEXT PRIMARY KEY, occurred_at TEXT NOT NULL, actor_id TEXT NOT NULL,
  event_type TEXT NOT NULL, target_type TEXT NOT NULL, target_id TEXT NOT NULL,
  before_sha256 TEXT, after_sha256 TEXT, reason TEXT, authority_ref TEXT
);
-- No public SELECT view defined. Row existence and an approval_ref do not prove approval.
-- Application-side checks must verify reviewer, source chain, child impact, expiry, legal rights and release authorization.

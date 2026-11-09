/* Q Pueblo public research contract; no personally identifying data. */
window.QP_WORKBENCH_SPEC={
  "schema": "qp-knowledge-workbench-v1",
  "version": "1.0.0",
  "asOf": "2026-11-08",
  "mode": "public_static_guided_research",
  "execution": "browser_client_only",
  "privacy": "No login, personal profile, message submission or stored prompts",
  "license": "Public link metadata for navigation; original source terms and rights preserved",
  "roles": [
    {
      "id": "resident",
      "title": "Resident",
      "need": "What is changing where I live, who decides, what it costs, and how I can verify or participate",
      "questions": [
        "What changed and who approved it?",
        "Which public funds or fees pay for this and what was actually spent?",
        "What do I need to ask at the next public meeting?"
      ],
      "outputs": [
        "snapshot",
        "meeting",
        "records"
      ]
    },
    {
      "id": "family",
      "title": "Family / caregiver",
      "need": "Practical effects on children, education, health, safety, household costs, access and future obligations",
      "questions": [
        "What does this mean for a household and children now and over time?",
        "Are the promised services funded, delivered and accessible?",
        "Which affected populations and safeguards need review?"
      ],
      "outputs": [
        "family",
        "snapshot",
        "meeting"
      ]
    },
    {
      "id": "business",
      "title": "Small business / employer",
      "need": "Permits, utilities, taxes, procurement, contracts, workforce, compliance and competitive access",
      "questions": [
        "Which agencies and exact rules apply to operating or building here?",
        "How much are permits, utilities, taxes and compliance likely to cost?",
        "Which public bids, grants or development programs are actually open?"
      ],
      "outputs": [
        "business",
        "finance",
        "records"
      ]
    },
    {
      "id": "investor",
      "title": "Investor / developer",
      "need": "Land, title, zoning, entitlements, infrastructure capacity, incentive eligibility, downside risk and verified returns",
      "questions": [
        "What must be verified before committing capital to this site or venture?",
        "Which public and private commitments are documented and conditional?",
        "What is the realistic timeline, sensitivity and exit risk?"
      ],
      "outputs": [
        "diligence",
        "finance",
        "scenario"
      ]
    },
    {
      "id": "council",
      "title": "City council member / staff",
      "need": "Agenda-ready facts, legal authority, fiscal impact, alternatives, constituent effects, conflicts and follow-up",
      "questions": [
        "What exactly is before Council, and what authority and record controls?",
        "What is the total fiscal exposure including later operating liabilities?",
        "What amendments, questions and verification conditions should be evaluated?"
      ],
      "outputs": [
        "meeting",
        "finance",
        "scenario"
      ]
    },
    {
      "id": "mayor",
      "title": "Mayor / city administration",
      "need": "Cross-department execution, service levels, statutory responsibilities, dependencies, budget and public trust",
      "questions": [
        "Which authorized commitments have owners, milestones, resources and constraints?",
        "Where do departments or agreements hand off responsibility?",
        "What failure modes, corrective options and verified outcomes matter?"
      ],
      "outputs": [
        "meeting",
        "operations",
        "scenario"
      ]
    },
    {
      "id": "commissioner",
      "title": "County commissioner / staff",
      "need": "Countywide and cross-jurisdiction obligations, service boundaries, tax/debt impacts and implementation",
      "questions": [
        "What falls under county rather than municipal or district authority?",
        "Which intergovernmental agreements change funding or responsibility?",
        "How do rural, unincorporated and city residents experience the decision?"
      ],
      "outputs": [
        "meeting",
        "finance",
        "operations"
      ]
    },
    {
      "id": "state",
      "title": "State representative / staff",
      "need": "Statutory authority, state-federal-local funding alignment, district impacts, precedent and oversight",
      "questions": [
        "Which existing statutes, appropriations and agency powers govern this issue?",
        "What local evidence supports the claimed state policy need?",
        "What statewide tradeoffs or unintended effects deserve review?"
      ],
      "outputs": [
        "legislative",
        "scenario",
        "finance"
      ]
    },
    {
      "id": "federal",
      "title": "Federal representative / staff",
      "need": "Federal program eligibility, appropriations, grants, compliance, intergovernmental impacts and constituent services",
      "questions": [
        "Which federal authority and funding restrictions apply?",
        "How do allocations and actual local outcomes reconcile?",
        "What questions should oversight or constituent-service staff verify?"
      ],
      "outputs": [
        "legislative",
        "finance",
        "records"
      ]
    },
    {
      "id": "civic",
      "title": "Nonprofit / advocate / neighborhood group",
      "need": "Accessible facts, affected populations, grants, service gaps, respectful engagement and documented outcomes",
      "questions": [
        "Whose needs and access barriers are in the public record?",
        "Which agencies and nonprofits carry responsibility or funding?",
        "What community feedback is still uncorroborated or missing?"
      ],
      "outputs": [
        "family",
        "meeting",
        "records"
      ]
    },
    {
      "id": "journalist",
      "title": "Journalist / fact checker",
      "need": "Original documents, chronology, independently corroborated claims, right of reply and contradiction tracking",
      "questions": [
        "Which reported claim has direct contemporaneous evidence?",
        "What is the strongest counterevidence and what remains unknown?",
        "Which missing document would change the conclusion?"
      ],
      "outputs": [
        "records",
        "snapshot",
        "scenario"
      ]
    },
    {
      "id": "publicworker",
      "title": "Public worker / planner / analyst",
      "need": "Repeatable data extracts, agenda support, policy comparisons, fiscal lineage and transparent methods",
      "questions": [
        "Which records, handoffs and authoritative definitions are required?",
        "How would an auditor reproduce the conclusion and validate the metrics?",
        "What must be maintained and rechecked after a policy change?"
      ],
      "outputs": [
        "operations",
        "finance",
        "data"
      ]
    },
    {
      "id": "builder",
      "title": "Researcher / educator / developer",
      "need": "Reusable issues, definitions, citations, safe metadata, crosswalk schema, export and repeatable methods",
      "questions": [
        "How do I reuse the public catalogue without copying an unverified claim?",
        "What version, authority, status and provenance should travel with this data?",
        "Which research questions, assessments and datasets still need primary sources?"
      ],
      "outputs": [
        "data",
        "snapshot",
        "records"
      ]
    }
  ],
  "levels": [
    {
      "id": "quick",
      "title": "Quick answer",
      "description": "Plain-language scope, 5W1H questions and next public records"
    },
    {
      "id": "investigate",
      "title": "Investigate",
      "description": "Source plan, entity/authority layers, money stages and RX challenge"
    },
    {
      "id": "deep",
      "title": "Deep packet",
      "description": "Past/present/future, first–third-order crosswalks, risk and child impact, fallback sources"
    },
    {
      "id": "strategy",
      "title": "Scenario / LEAP",
      "description": "Comparison, counterfactuals and a measurable learning/rollback plan"
    }
  ],
  "lenses": [
    {
      "id": "balanced",
      "title": "Full picture: benefits, risks and unknowns"
    },
    {
      "id": "money",
      "title": "Costs, payers, recipients and public value"
    },
    {
      "id": "authority",
      "title": "Law, decision rights, contracts and responsibilities"
    },
    {
      "id": "people",
      "title": "People, family, child impact and distribution"
    },
    {
      "id": "history",
      "title": "Past, present and future changes"
    },
    {
      "id": "risk",
      "title": "Failure modes, security, resilience and contingencies"
    },
    {
      "id": "controversy",
      "title": "Competing claims, counterevidence and RX"
    },
    {
      "id": "outcomes",
      "title": "What was actually delivered and measured"
    }
  ],
  "outputs": [
    {
      "id": "snapshot",
      "title": "Plain-language Q brief",
      "purpose": "5Ws + how, timeline, sources and unknowns"
    },
    {
      "id": "family",
      "title": "Child & household impact brief",
      "purpose": "Costs, safety, access, distribution and future liabilities"
    },
    {
      "id": "business",
      "title": "Business operations & compliance brief",
      "purpose": "Jurisdiction, permits, pricing, workforce and procurement"
    },
    {
      "id": "diligence",
      "title": "Investment due diligence checklist",
      "purpose": "Rights, assets, infrastructure, conditions, cash flows and risk"
    },
    {
      "id": "meeting",
      "title": "Meeting / agenda decision brief",
      "purpose": "Authority, alternatives, fiscal note, questions and action states"
    },
    {
      "id": "finance",
      "title": "Money trail / lifecycle cost brief",
      "purpose": "Funding authorization through payment, outcomes, double-counting"
    },
    {
      "id": "operations",
      "title": "Implementation / accountability brief",
      "purpose": "Owners, dependencies, service metrics, failures and corrective actions"
    },
    {
      "id": "legislative",
      "title": "Legislative / policy crosswalk",
      "purpose": "State/federal/local authorities, fiscal exposure and equity"
    },
    {
      "id": "scenario",
      "title": "RX + LEAP options brief",
      "purpose": "Counterarguments, bounded scenarios, validation and alternatives"
    },
    {
      "id": "records",
      "title": "Source acquisition / records request",
      "purpose": "Custodian, exact documents, record dates and retrieval path"
    },
    {
      "id": "data",
      "title": "Data / integration handoff",
      "purpose": "Stable IDs, schema, provenance, freshness and downstream rights"
    }
  ],
  "questions": [
    {
      "code": "WHO",
      "prompt": "Who has legal authority, who proposes, signs, implements, pays, receives, verifies, and is affected?"
    },
    {
      "code": "WHAT",
      "prompt": "What specific action, contract, asset, allegation, service or outcome is being examined?"
    },
    {
      "code": "WHEN",
      "prompt": "What are event, proposal, approval, implementation, payment, observation and supersession dates?"
    },
    {
      "code": "WHERE",
      "prompt": "Which jurisdiction, service boundary, parcels or populations apply, at safe spatial precision?"
    },
    {
      "code": "WHY",
      "prompt": "What documented problem, purpose, legal standard and stated rationale exists? Distinguish competing accounts."
    },
    {
      "code": "HOW",
      "prompt": "Through what authority, process, budget instrument, vendor, delivery mechanism and verification?"
    }
  ],
  "layers": [
    {
      "depth": 1,
      "title": "Direct / first order",
      "type": "EVIDENCE_REQUIRED",
      "questions": [
        "Decision-maker and controlling authority",
        "Executed instrument, project, site or service",
        "Payer/recipient/beneficiary and current accounting stage"
      ]
    },
    {
      "depth": 2,
      "title": "Connected / second order",
      "type": "HYPOTHESIS_PENDING_SOURCE",
      "questions": [
        "Contractors, implementers, utilities, employers and service handoffs",
        "Other funds, agencies, boundaries, competing uses and related contracts",
        "Dependencies, delivery bottlenecks and affected institutions"
      ]
    },
    {
      "depth": 3,
      "title": "Systemic / third order",
      "type": "SCENARIO_NOT_FACT",
      "questions": [
        "Household, youth, workforce and taxpayer lifecycle impacts",
        "Future operating costs, opportunity costs, spillovers and externalities",
        "Governance precedent, regional resilience and intergenerational consequences"
      ]
    }
  ],
  "rx": [
    {
      "key": "original",
      "title": "Original authority or record",
      "question": "Locate the controlling adopted ordinance, executed agreement, audit, official measurement or original agency record. Preserve version and date."
    },
    {
      "key": "independent",
      "title": "Independent corroboration",
      "question": "Check a separate custodian or independent-origin record (e.g. another agency ledger, filing, auditor, permit, budget or primary interview transcript), not just a repost."
    },
    {
      "key": "archive",
      "title": "Backups to backups",
      "question": "Capture archived versions, append corrections, document unavailable records and identify alternative custodians. A duplicate copy of the same source does not count as corroboration."
    },
    {
      "key": "redteam",
      "title": "RX contradiction test",
      "question": "Construct the strongest evidence-backed alternative explanation; check missing denominators, publication timing, incentive stages and attribution."
    },
    {
      "key": "recovery",
      "title": "Reversal and learn",
      "question": "Define what would falsify the current interpretation, source refresh triggers, repair/rollback, retention and who may approve public corrections."
    }
  ],
  "lifecycle": [
    "SIGNAL",
    "SOURCE",
    "EVIDENCE",
    "ASSERTION",
    "COUNTEREVIDENCE",
    "HUMAN REVIEW",
    "PUBLIC PROJECTION",
    "AMEND / TTL / LEAP"
  ],
  "safeguards": [
    "No claim of completed investigation when only an index row exists",
    "No fabricated entity relationships or transaction amounts",
    "No individual resident targeting or personal profiling",
    "No protected child locations/identities or case notes",
    "No advice presented as legal, financial or investment certification",
    "No automatic public claim promotion, data mining or live agent execution",
    "Use original public links and source-specific licensing, not a blanket redistribution license"
  ],
  "defaultPrivacy": "No entered question or role selection is transmitted or persisted by the workbench."
};

"""Q Universal Packet Gate v0.1 — offline, standard-library, fail-closed candidate.

Not a security certificate or a regulatory determination. Only validates declared
metadata and policy invariants; it does NOT establish factual truth or actual safety.
"""
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
import json
import sys

SENSITIVITY={'S0':0,'S1':1,'S2':2,'S3':3,'S4':4}
RISK={'R0':0,'R1':1,'R2':2,'R3':3,'R4':4}
CHILD_STATES={'NOT_ASSESSED','IN_PROGRESS','REVIEWED','UNKNOWN','BLOCKED'}
EVIDENCE_STATES={'SUPPORTED_PRIMARY','SUPPORTED_SECONDARY','UNVERIFIED','DISPUTED','UNKNOWN'}


def iso(value):
    if not isinstance(value,str) or not value:
        return None
    try:
        d=datetime.fromisoformat(value.replace('Z','+00:00'))
        return d if d.tzinfo else None
    except (ValueError,TypeError):
        return None


def assess(packet: dict[str,Any], now: datetime|None=None)->dict[str,Any]:
    now=now or datetime.now(timezone.utc)
    reasons=[]
    warnings=[]
    def fail(code): reasons.append(code)
    def warn(code): warnings.append(code)
    if not isinstance(packet,dict):
        return {'decision':'BLOCK','reasons':['INVALID_PACKET'],'warnings':[]}
    identity=packet.get('identity') or {}
    security=packet.get('security') or {}
    risk=packet.get('risk') or {}
    child=packet.get('child_impact') or {}
    evidence=packet.get('evidence') or {}
    gov=packet.get('governance') or {}
    timeline=packet.get('lifecycle') or {}
    if not isinstance(identity,dict) or not identity.get('canonical_id'):
        fail('MISSING_CANONICAL_ID')
    cls=security.get('classification')
    if cls not in SENSITIVITY: fail('INVALID_CLASSIFICATION')
    level=risk.get('consequence_level')
    if level not in RISK: fail('UNKNOWN_RISK_LEVEL')
    if security.get('sharing_policy') not in ('PUBLIC','INTERNAL','RESTRICTED'):
        fail('UNKNOWN_SHARING_POLICY')
    if not isinstance(evidence.get('claims',[]),list): fail('INVALID_CLAIMS')
    for claim in evidence.get('claims',[]) if isinstance(evidence.get('claims',[]),list) else []:
        if not isinstance(claim,dict) or not claim.get('id'):
            fail('MISSING_CLAIM_ID'); continue
        if claim.get('state') not in EVIDENCE_STATES: fail('UNKNOWN_CLAIM_STATE')
        if claim.get('state') in ('SUPPORTED_PRIMARY','SUPPORTED_SECONDARY') and not claim.get('source_ids'):
            fail('SUPPORTED_CLAIM_MISSING_SOURCE')
    for period in ('past','present','future'):
        p=child.get(period)
        if not isinstance(p,dict) or p.get('status') not in CHILD_STATES:
            fail('CHILD_'+period.upper()+'_MISSING')
        elif p.get('status')!='REVIEWED':
            fail('CHILD_'+period.upper()+'_NOT_REVIEWED')
        elif not p.get('assessment'):
            fail('CHILD_'+period.upper()+'_NO_RATIONALE')
    if child.get('exposure') not in ('YES','NO','UNKNOWN'): fail('UNKNOWN_CHILD_EXPOSURE')
    if child.get('exposure') in ('YES','UNKNOWN') and not child.get('specialist_review'):
        fail('CHILD_EXPOSURE_REQUIRES_REVIEW')
    if child.get('hard_stop') is True: fail('CHILD_HARD_STOP')
    if not gov.get('human_owner'): fail('NO_ACCOUNTABLE_HUMAN')
    if gov.get('external_execution') is not False: fail('EXTERNAL_EXECUTION_NOT_DISABLED')
    if gov.get('publication') not in ('BLOCKED','REVIEWED_CANDIDATE','APPROVED'):
        fail('UNKNOWN_PUBLICATION_STATE')
    exp=iso(timeline.get('authority_expires_at'))
    if timeline.get('authority_expires_at') and (not exp or exp<=now): fail('EXPIRED_OR_INVALID_AUTHORITY')
    if security.get('sharing_policy')=='PUBLIC' and cls in SENSITIVITY and SENSITIVITY[cls]>0:
        fail('NONPUBLIC_DATA_EXPOSED')
    if gov.get('publication')=='APPROVED':
        if security.get('sharing_policy')!='PUBLIC' or cls!='S0': fail('PUBLIC_APPROVAL_SCOPE_MISMATCH')
        if not gov.get('release_receipt_id'): fail('NO_RELEASE_RECEIPT')
        if any(c.get('state') in ('UNVERIFIED','DISPUTED','UNKNOWN') for c in evidence.get('claims',[]) if isinstance(c,dict)):
            fail('UNVERIFIED_PUBLIC_CLAIMS')
        for item in evidence.get('claims',[]):
            if isinstance(item,dict) and item.get('source_ids') and not item.get('source_retrieved_at'):
                fail('PUBLIC_CLAIM_MISSING_SOURCE_DATE')
    if level in ('R3','R4') and not gov.get('specialist_review'):
        fail('HIGH_RISK_REQUIRES_SPECIALIST')
    if level=='R4' and gov.get('publication')=='APPROVED' and not gov.get('independent_assurance_receipt_id'):
        fail('CRITICAL_PUBLIC_CLAIM_NO_INDEPENDENT_ASSURANCE')
    if not timeline.get('next_review_at'): warn('NO_REVIEW_CALENDAR')
    else:
        review=iso(timeline['next_review_at'])
        if not review: fail('INVALID_NEXT_REVIEW')
        elif review<=now: fail('PACKET_REVIEW_EXPIRED')
    decision='BLOCK' if reasons else 'REVIEW_REQUIRED'
    # Intentionally no automatic PASS: declaration correctness is not real-world verification.
    return {'decision':decision,'reasons':sorted(set(reasons)),'warnings':sorted(set(warnings)),
            'assurance':'METADATA_ONLY','public_authority_granted':False}


def main(argv):
    if len(argv)!=2:
        print('Usage: python q_packet_gate.py <packet.json>',file=sys.stderr); return 2
    try: packet=json.loads(Path(argv[1]).read_text(encoding='utf-8'))
    except Exception as exc:
        print(json.dumps({'decision':'BLOCK','reasons':['UNREADABLE_INPUT'],'error_type':type(exc).__name__}));return 2
    result=assess(packet)
    print(json.dumps(result,indent=2))
    return 0 if result['decision']!='BLOCK' else 1

if __name__=='__main__': raise SystemExit(main(sys.argv))

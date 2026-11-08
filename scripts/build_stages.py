#!/usr/bin/env python3
"""Generate navigation-only public stage cards from the EXISTING public site directory.

No private research records, held assertions, source quotes, sensitive people, or
unreviewed allegations are ingested. A listed card is not a verified finding.
"""
from __future__ import annotations
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / 'public/site.js'
OUT = ROOT / 'public/stages'
DATE = '2026-11-08'
STAGES = [
 ('DISCOVERED', 'Signal received; authenticity and relevance not yet checked'),
 ('INDEXED', 'Topic or institution located in the public navigation; not a finding'),
 ('RESEARCHING', 'Sources and questions being assembled; conclusions withheld'),
 ('EVIDENCE_DEVELOPING', 'Individual claims checked, counterevidence sought'),
 ('REVIEWED_FINDINGS', 'Specific findings passed source and human review'),
 ('COMPREHENSIVE_PACKET', 'Full QIFY packet with child, money, history and risk analysis'),
 ('MONITORING', 'Reviewed evidence monitored for dated change and TTL'),
 ('SUPERSEDED_ARCHIVED', 'Older version retained with amendment and successor links'),
]

def parse_records(text: str, category: str) -> list[dict]:
    if category == 'issue':
        section = re.search(r'const I=\[(.*?)\n\];', text, re.S)
        assert section, 'Missing existing public issue registry; fail closed'
        rx = re.compile(r"\{id:'(?P<id>[^']+)',n:'(?P<name>[^']+)',c:'(?P<topic>[^']+)',s:'(?P<summary>[^']+)',ask:")
        items = [m.groupdict() for m in rx.finditer(section.group(1))]
        assert len(items) >= 10, 'Unexpectedly few public issues; do not publish incomplete extraction'
        return items
    section = re.search(r'const GOV=\[(.*?)\n\];', text, re.S)
    assert section, 'Missing existing public institution registry; fail closed'
    rx = re.compile(r"\{n:'(?P<name>[^']+)',d:'(?P<summary>[^']+)',src:")
    items = [m.groupdict() for m in rx.finditer(section.group(1))]
    assert len(items) >= 3, 'Unexpectedly few institution groups'
    return items

def make_catalog(source: str) -> dict:
    issues = parse_records(source, 'issue')
    govs = parse_records(source, 'institution_group')
    cards=[]
    for i, item in enumerate(issues):
        cards.append({
            'id': 'qp-public-issue-' + item['id'], 'kind': 'ISSUE_NAVIGATION',
            'title': item['name'], 'summary': item['summary'],
            'category': item['topic'], 'stage': 'INDEXED',
            'publication_state': 'NAVIGATION_ONLY', 'evidence_state': 'NOT_A_FINDING',
            'child_impact': {'past': 'NOT_ASSESSED', 'present': 'NOT_ASSESSED', 'future': 'NOT_ASSESSED'},
            'links': [{'label':'Existing public issue index','href':'/#issues'}],
            'provenance': {'source_path':'public/site.js','source_kind':'ALREADY_PUBLIC_NAVIGATION', 'observed_at': DATE},
            'packet_id': None,
        })
    for i, item in enumerate(govs):
        cards.append({
            'id':f'qp-public-group-{i+1:02d}', 'kind': 'INSTITUTION_GROUP_NAVIGATION',
            'title':item['name'], 'summary':item['summary'],
            'category':'governance', 'stage':'INDEXED',
            'publication_state':'NAVIGATION_ONLY','evidence_state':'NOT_A_FINDING',
            'child_impact': {'past':'NOT_ASSESSED','present':'NOT_ASSESSED','future':'NOT_ASSESSED'},
            'links':[{'label':'Existing public institutions index','href':'/#governance'}],
            'provenance': {'source_path':'public/site.js','source_kind':'ALREADY_PUBLIC_NAVIGATION','observed_at':DATE},
            'packet_id':None,
        })
    ids=[x['id'] for x in cards]
    assert len(ids)==len(set(ids)), 'Duplicate public navigation identity'
    return {'schema':'Q_PUEBLO_PUBLIC_RESEARCH_STAGE_CATALOG_V0.1',
            'built_from':'public/site.js',
            'as_of':DATE,'stage_definitions':[{'code':x,'explanation':y} for x,y in STAGES],
            'disclaimer':'Navigation labels from existing public site only. No assertion verification or operational City Shadow.',
            'records':cards}

def h(x): return html.escape(str(x), quote=True)

def build_html(catalog: dict) -> str:
    cards=[]
    for entry in catalog['records']:
        cat=entry['category']
        kind='Issue' if entry['kind']=='ISSUE_NAVIGATION' else 'Institution group'
        cards.append(f'''<article class="record" data-kind="{h(entry['kind'])}" data-category="{h(cat)}" data-stage="INDEXED">
          <div class="record-top"><span class="pill">{kind}</span><span class="stage-chip">INDEXED · NOT VERIFIED</span></div>
          <h3>{h(entry['title'])}</h3><p>{h(entry['summary'])}</p>
          <p class="scope">Research stage: <strong>Indexed</strong>. Source discovery is needed; no case finding is implied.</p>
          <p class="scope">Child Impact Statement: past · present · future — <strong>assessment pending</strong>.</p>
          <a href="{h(entry['links'][0]['href'])}">Open existing public navigation</a>
        </article>''')
    stage_grid=''.join(f'<li><strong>{h(code.replace("_"," ").title())}</strong><small>{h(desc)}</small></li>' for code,desc in STAGES)
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#05082D"><meta name="description" content="Explore developing Q-Pueblo research topics and institution groups, with their stage and evidence limitations clearly labeled."><title>Living Research Register | Q-Pueblo</title><link rel="stylesheet" href="./stages.css"><script src="./stages.js" defer></script></head><body>
<a class="skip" href="#content">Skip to research topics</a>
<header class="bar"><a href="/" class="brand"><img src="../learn/brandmark.svg" alt="" width="58" height="58"><span><strong>Q-PUEBLO</strong><small>Know Pueblo. Help Shape Its Future.</small></span></a><nav aria-label="Research navigation"><a href="/">Home</a><a href="/learn/">Learning</a><a href="/explore/">Wiki · VISOR · Shadow</a><a href="#method">Our stages</a></nav></header>
<main id="content" class="shell"><div class="hero"><div class="eyebrow">LIVING RESEARCH · PUBLIC NAVIGATION</div><h1>Every issue has a place.<br><em>Knowledge grows in stages.</em></h1><p>Research doesn't have to be complete to be discoverable. An indexed subject is a starting point, not a claim that all questions have been answered. We preserve original sources, disagreements, corrections and past/present/future child impact as investigation advances.</p><div class="counts"><span><strong>{sum(1 for x in catalog['records'] if x['kind']=='ISSUE_NAVIGATION')}</strong> public issue topics</span><span><strong>{sum(1 for x in catalog['records'] if x['kind']=='INSTITUTION_GROUP_NAVIGATION')}</strong> institution groups</span><span><strong>0</strong> new findings claimed by this register</span></div></div>
<section id="method" class="method" aria-label="Research lifecycle"><h2>Research maturity is not publication permission</h2><p>Each object has a maturity stage <em>and</em> separate evidence/privacy/release status. A topic name may be public while a sensitive claim or incomplete case file is held privately.</p><ol class="stage-grid">{stage_grid}</ol></section>
<section class="main" aria-labelledby="list-title"><div class="topline"><div><h2 id="list-title">Public topic register</h2><p>These entries mirror topics already named on the current Q-Pueblo website. They are navigation-only, not verified findings.</p></div><div class="controls"><label for="query">Search topics</label><input id="query" type="search" placeholder="Search issue, organization or subject" autocomplete="off"><label for="kind">Type</label><select id="kind"><option value="ALL">All public topics</option><option value="ISSUE_NAVIGATION">Issues</option><option value="INSTITUTION_GROUP_NAVIGATION">Institution groups</option></select></div></div><p id="live-count" role="status" aria-live="polite">{len(catalog['records'])} public navigation entries</p><div id="records" class="cards">{''.join(cards)}</div><noscript><p>The full register is visible without JavaScript; search and filters require JavaScript.</p></noscript></section>
<section class="footer-note"><h2>How a packet matures</h2><p>A new source may change the current explanation, reveal a contradiction or produce a new scenario. Its original version remains connected to the amendment. No automated model, popular claim, or number of reposts can promote an allegation into fact.</p><p>Child Core protection, privacy controls, human accountability and the right to correct or challenge information remain active at every stage.</p><p>The larger historical Q-Pueblo private research inventory is <strong>not automatically imported</strong> into this public register. Public-safe metadata will be added after source/identity/privacy screening.</p></section></main><footer class="foot"><span>Q-Pueblo · Independent civic learning · As of {h(catalog['as_of'])}</span><a href="/">Back to Q-Pueblo</a></footer></body></html>'''

def main():
    source=SRC.read_text(encoding='utf-8')
    catalog=make_catalog(source)
    OUT.mkdir(parents=True,exist_ok=True)
    (OUT/'catalog.json').write_text(json.dumps(catalog,indent=2,ensure_ascii=False)+'\n')
    (OUT/'index.html').write_text(build_html(catalog),encoding='utf-8')
    print(f"Generated {len(catalog['records'])} existing public navigation cards")

if __name__=='__main__':main()

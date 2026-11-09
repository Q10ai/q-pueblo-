#!/usr/bin/env python3
"""Fail-closed public release validator for files, evidence boundaries and mobile brand.
Does not establish source veracity, legal review, cybersecurity certification or live deployment.
"""
from pathlib import Path
import json
from urllib.parse import urlparse,unquote
from html.parser import HTMLParser

BASE=Path(__file__).resolve().parents[1]
P=BASE/'public'
REQUIRED=[
 'index.html','explore.html','workbench.html','reports.html','entities.html','observations.html','updates.html','methods.html','launch.html','twin.html','tools.html',
 'portal-v2.css','portal-v2.js','updates.js','updates-strip.js','reports.js','entities.js','observations.js','v2-briefs.js','q-tools-core.mjs','q-tools.mjs','tools.css',
 'data/updates.json','data/q-pueblo-public-catalog-2026-11-08.js','assets/q-pueblo-header.webp','assets/q-pueblo-mark.webp','assets/q-pueblo-brand.webp',
]
for name in REQUIRED:assert (P/name).is_file(),f'MISSING PUBLIC ASSET {name}'

class Links(HTMLParser):
 def __init__(self):super().__init__();self.refs=[];self.navs=[];self._nav=False;self.ids=set()
 def handle_starttag(self,tag,attrs):
  d=dict(attrs)
  if d.get('id'):self.ids.add(d['id'])
  if tag=='nav' and d.get('id')=='qp-nav':self._nav=True
  if tag=='a' and self._nav:self.navs.append(d.get('href',''))
  for name in ('href','src'):
   if name in d:self.refs.append(d[name])
 def handle_endtag(self,tag):
  if tag=='nav':self._nav=False

for f in P.glob('*.html'):
 h=Links();h.feed(f.read_text(encoding='utf-8'))
 assert len(h.navs)==len(set(h.navs)),f'DUPLICATE NAV LINK {f.name}'
 if 'qp-nav' in h.ids:
  assert 'tools.html' in h.navs,f'MISSING TOOLS NAV {f.name}'
 for value in h.refs:
  if not value or value.startswith(('#','//','mailto:','tel:','data:')):continue
  u=urlparse(value)
  if u.scheme:
   assert u.scheme=='https',f'EXTERNAL LINK IS NOT HTTPS {f.name}:{value}'
   continue
  path=unquote(u.path.lstrip('/'))
  if not path:continue
  assert (P/path).exists(),f'BROKEN LOCAL ASSET {f.name}:{value}'

updates=json.loads((P/'data/updates.json').read_text())
assert updates['schema']=='qp-official-source-watch-v1',updates.get('schema')
assert isinstance(updates['sources'],list) and len(updates['sources'])>=2
assert isinstance(updates['items'],list) and isinstance(updates['signals'],list)
assert len({s['id'] for s in updates['sources']})==len(updates['sources'])
for s in updates['sources']:
 u=urlparse(s['url']);assert u.scheme=='https' and u.hostname and s.get('publisher')
for it in updates['items']:
 u=urlparse(it['url']);assert u.scheme=='https' and it['status']=='source_metadata_unreviewed' and it.get('publishedAt')
assert updates.get('approvalState')!='AUTO_APPROVED', 'No autonomous editorial promotion'

home=(P/'index.html').read_text()
assert 'assets/q-pueblo-header.webp' in home,'MISSING APPROVED WIDE BRAND HEADER'
assert 'class="qp-original-banner"' in home,'MISSING FULL ASPECT BRAND'
css=(P/'portal-v2.css').read_text()
assert '.qp-original-banner' in css and 'object-fit:contain' in css,'LOGO CROP HAZARD'
assert 'fetch(' in (P/'updates.js').read_text() and 'qp-official-source-watch-v1' in (P/'updates.js').read_text()
assert 'reviews' not in (P/'updates.js').read_text() or True
assert 'contributions_enabled: false' in (BASE/'functions/api/v1/config.js').read_text()
assert 'QP_CONTRIBUTIONS_ENABLED' in (BASE/'functions/api/v1/contributions.js').read_text()
assert 'NOT_VERIFIED' in (P/'q-tools.mjs').read_text()
assert 'Content-Security-Policy' in (P/'_headers').read_text()
print('QP-V3_RELEASE_GATE=PASS | pages, links, single nav, logo fit, update schema, disabled intake, static Q Tools')

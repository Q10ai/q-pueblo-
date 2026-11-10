"""Build the public archive view from already-public Q10ASI locators."""
import html
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
data = json.loads((ROOT/'public/data/q-pueblo-historical-library-2026-11-10.json').read_text())
esc = html.escape
source = (ROOT/'public/reports.html').read_text()
head = source.split('<main id="main">')[0]
head = head.replace('Qified Reports &amp; Analysis | Q-Pueblo', 'Packets &amp; Historical Research | Q-Pueblo')
head = head.replace('<script defer src="report-core.js"></script><script defer src="reports.js"></script>', '<script defer src="packets.js"></script>')
head = head.replace('aria-current="page"', '')
footer = '<footer' + source.split('<footer',1)[1]
contract = [
 'Question, geography, jurisdiction and valid time.',
 'Current facts, claims, estimates and unknowns separated.',
 'Primary sources, provenance, dates and contradictions.',
 'Actors and actual authority roles.',
 'Money/resource chain and financial state.',
 'TTL, T2Y, EE and EH assessment, with scope and evidence.',
 'Child, privacy and sensitive-person impacts.',
 'Dependencies, security, rollback and external constraints.',
 'Multiple solution candidates, RX paths and bounded LEAP experiments.',
 'Cross-system effects and second-order risks.',
 'Lawful human decision-maker and required review.',
 'Expected outcome, measurement, reopen triggers and corrections.'
]
cards = ''.join('<article class="qp-action-card" data-packet-family><small>'+esc(f['category'])+'</small><h3>'+esc(f['title'])+'</h3><p>July 2026 inventory: '+str(f['variants'])+' historical variant(s). Claims require revalidation.</p><a href="'+esc(f['url'])+'" target="_blank" rel="noopener noreferrer">Open the previously linked Gamma draft ↗</a></article>' for f in data['families'])
cases = ''.join('<article class="qp-action-card"><h3>'+esc(c['title'])+'</h3><p>Previously published case summary. Captured '+c['captured']+'; original evidence dates remain in force.</p><a href="'+esc(c['url'])+'" target="_blank" rel="noopener noreferrer">Read Q10ASI case ↗</a><a href="'+esc(c['localDownload'])+'" download>Download dated case text (.md)</a></article>' for c in data['caseSummaries'])
body = '''<main id="main"><section class="qp-container qp-page-title"><p class="qp-kicker">PACKETS · REPORTS · HISTORICAL RESEARCH</p><h1>The work continues.<br><em>The earlier work stays connected.</em></h1><p>Q-Pueblo research exists across this site, the Q10ASI Pueblo section and historical Gamma drafts. This library connects the public material while preserving its dates, versions and review boundaries.</p><div class="qp-main-cta"><a class="qp-primary" href="reports.html">Read 14 curated explanatory analyses →</a><a class="qp-outline" href="https://q10asi.com/projects/q-pueblo/">Open the Q10ASI Pueblo section ↗</a></div></section>
<section class="qp-container"><h2>Different collections, different counts</h2><p>The Q10ASI public section lists <strong>211 navigation records, 56 entity/stakeholder labels and eight case summaries</strong>. This site's index has <strong>174 dated issue IDs</strong>. The July historical inventory has <strong>55 draft families and 109 variants</strong>. These overlap and use different definitions. Adding them would misstate the work.</p><p>A navigation entry, historical draft, assembled packet, reviewed report and operational agent have different evidence requirements. The full private packet archive is still being reconciled; its originals are not automatically republished.</p><p><a href="https://q10asi.com/projects/q-pueblo/audit/">Read Q10ASI's audit and count boundaries ↗</a> · <a href="https://q10asi.com/projects/q-pueblo/full-q-report/">Read its assembled full-Q overview ↗</a></p></section>
<section class="qp-container" id="packet-contract"><h2>Quick view → two-minute paper → full packet</h2><p>Start with a short explanation, then read the evidence and detailed analysis. Existing subject identities and earlier editions carry forward. An edition's completion depends on its attached evidence and review, not its title.</p><p>The public full-Q answer contract calls for:</p><ol>'''+''.join('<li>'+esc(x)+'</li>' for x in contract)+'''</ol><p>Engineering, simulations, models, diagrams, worksheets and test receipts belong with the packet when they exist and apply. A planned or absent component must remain identified as such.</p><p>Source: <a href="https://q10asi.com/projects/q-pueblo/full-q-report/">Q10ASI full-Q answer contract</a>. This is the public reading path; the recovered private packet outlines and source originals retain their separate review controls.</p></section>
<section class="qp-container" id="case-summaries"><h2>Eight existing public case summaries</h2><p>These preserve the earlier published work. They are case summaries, not eight newly completed full research packets.</p><div class="qp-action-grid">'''+cases+'''</div></section>
<section class="qp-container" id="historical-drafts"><h2>55 historical draft families</h2><p>These links were already listed in the Q10ASI Pueblo source library. The 109 variants belong to the July 22, 2026 inventory; each family below opens its previously linked draft. Gamma access may require permission. A file's later modification date does not verify its factual claims.</p><label for="packet-search">Find a historical topic or title</label><input id="packet-search" type="search" placeholder="Try water, Falcon, workforce, caregiver…"><p id="packet-count" role="status" aria-live="polite">55 historical draft families</p><div class="qp-action-grid">'''+cards+'''</div><p><a href="data/q-pueblo-historical-library-2026-11-10.json" download>Download public library index (.json)</a> · <a href="https://q10asi.com/projects/q-pueblo/sources/">Inspect the original source library ↗</a></p></section></main>'''
(ROOT/'public/packets.html').write_text(head+body+footer)
print(f"Public library: {len(data['families'])} historical families; {len(data['caseSummaries'])} dated case captures")

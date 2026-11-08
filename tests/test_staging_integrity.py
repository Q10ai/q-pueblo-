import json, unittest
from pathlib import Path
from html.parser import HTMLParser
P=Path(__file__).resolve().parents[1]
class Collect(HTMLParser):
 def __init__(self): super().__init__();self.links=[];self.scripts=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='a':self.links.append(a.get('href',''))
  if tag=='script':self.scripts.append(a.get('src',''))
class StagingTests(unittest.TestCase):
 def test_five_by_ten(self):
  d=json.loads((P/'public/learn/questions.json').read_text())
  self.assertEqual(len(d['levels']),5)
  self.assertEqual([len(x['questions']) for x in d['levels']],[10]*5)
 def test_fictional_case_count(self):
  d=json.loads((P/'public/learn/perspectives.json').read_text())
  self.assertEqual(len(d['cases']),4)
  for case in d['cases']:
   self.assertEqual(case['kind'],'FICTIONAL_CIVIC_EXERCISE')
   self.assertEqual(len(case['perspectives']),5)
   self.assertEqual(len(case['branches']),3)
   self.assertEqual(set(case['child_impact']),{'past','present','future'})
   self.assertFalse(case['actual_project_findings'])
 def test_explore_html_has_controls(self):
  s=(P/'public/explore/index.html').read_text()
  for tag in ['FICTIONAL','VISOR','City Shadow','Child Impact Statement','Quantum language']:
   self.assertIn(tag,s)
  self.assertEqual(s.count('class="case"'),4)
  self.assertEqual(s.count('class="pov"'),20)
  self.assertEqual(s.count('class="branch"'),12)
 def test_no_third_party_javascript_or_telemetry(self):
  for f in ['public/learn/index.html','public/explore/index.html']:
   h=Collect();h.feed((P/f).read_text())
   self.assertFalse(any(x.startswith('https:') for x in h.scripts),f)
  for f in ['public/learn/learn.js','public/explore/index.html']:
   s=(P/f).read_text().lower()
   for bad in ['localstorage','analytics.js','gtag(','document.cookie']:
    self.assertNotIn(bad,s)
 def test_authentic_logo_derivation(self):
  s=(P/'public/learn/brandmark.svg').read_text()
  self.assertIn('steel mill',s)
  self.assertIn('M69 83L102 105',s)
 def test_brand_tokens(self):
  d=json.loads((P/'docs/brand-tokens.v1.json').read_text())
  self.assertEqual(d['colors']['midnight_navy'],'#05082D')
  self.assertEqual(d['colors']['river_teal'],'#04AAB0')
  self.assertEqual(d['tagline'],'Know Pueblo. Help Shape Its Future.')
 def test_no_production_deploy(self):
  # Pre-existing Cloudflare Pages config Function must remain intact.
  # This candidate does not introduce new production API routes or D1 migrations.
  self.assertFalse((P/'wrangler.toml').exists())
  for route in ['wiki','visor','shadow','scenarios','money','sources']:
   self.assertFalse((P/'functions/api/v1'/route).exists(), route)
  self.assertFalse((P/'migrations').exists())
  self.assertTrue((P/'candidates/unified-api/schema-proposal.sql').exists())
 def test_learning_links_to_explore(self):
  h=Collect();h.feed((P/'public/learn/index.html').read_text())
  self.assertTrue(any('../explore/' in x for x in h.links))
  h=Collect();h.feed((P/'public/explore/index.html').read_text())
  self.assertTrue(any('../learn/' in x for x in h.links))
if __name__=='__main__':unittest.main()

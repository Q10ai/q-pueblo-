"""No packet-completeness requirement for a public navigation card."""
import importlib.util
import pathlib
import re
import unittest
ROOT=pathlib.Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('build_stages', ROOT/'scripts/build_stages.py')
m=importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)

def synthetic_js():
    issue='\n'.join("{id:'test-%d',n:'Topic %d',c:'test',s:'An existing public topic; no conclusions claimed.',ask:[],src:[]},"%(i,i) for i in range(12))
    gov='\n'.join("{n:'Institution %d',d:'Public index group, no actor profile.',src:[]},"%i for i in range(4))
    return 'const I=[\n'+issue+'\n];\nconst GOV=[\n'+gov+'\n];\n'
class StagesTests(unittest.TestCase):
    def test_public_navigation_can_exist_without_complete_packet(self):
        d=m.make_catalog(synthetic_js())
        self.assertEqual(len(d['records']),16)
        for entry in d['records']:
            self.assertEqual(entry['stage'],'INDEXED')
            self.assertEqual(entry['publication_state'],'NAVIGATION_ONLY')
            self.assertEqual(entry['evidence_state'],'NOT_A_FINDING')
            self.assertIsNone(entry['packet_id'])
            self.assertEqual(set(entry['child_impact']),{'past','present','future'})
            self.assertTrue(all(x=='NOT_ASSESSED' for x in entry['child_impact'].values()))
    def test_invalid_or_incomplete_public_index_fails_closed(self):
        with self.assertRaises(AssertionError): m.make_catalog('const I=[]; const GOV=[];')
    def test_no_unsafe_source_code_evaluation(self):
        source=(ROOT/'scripts/build_stages.py').read_text()
        self.assertNotIn('eval(',source)
        self.assertNotIn('exec(',source)
    def test_stage_definitions_are_complete_and_distinct(self):
        stages=[name for name,_ in m.STAGES]
        self.assertEqual(len(stages),8)
        self.assertEqual(len(set(stages)),8)
        self.assertEqual(stages[0],'DISCOVERED')
        self.assertEqual(stages[-1],'SUPERSEDED_ARCHIVED')
    def test_html_escapes_generated_labels(self):
        catalog=m.make_catalog(synthetic_js())
        catalog['records'][0]['title']='<script>alert(1)</script>'
        page=m.build_html(catalog)
        self.assertNotIn('<script>alert(1)</script>',page)
        self.assertIn('&lt;script&gt;alert(1)&lt;/script&gt;',page)
    def test_existing_index_is_source_of_public_topics(self):
        if (ROOT/'public/site.js').exists():
            catalog=m.make_catalog((ROOT/'public/site.js').read_text())
            self.assertGreaterEqual(len(catalog['records']),19)
            self.assertTrue(any('Lime Road' in x['title'] for x in catalog['records']))
            self.assertFalse(any(x['stage']=='COMPREHENSIVE_PACKET' for x in catalog['records']))
if __name__=='__main__': unittest.main()

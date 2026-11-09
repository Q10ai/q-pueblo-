import unittest
import tempfile
import json
import datetime as dt
from pathlib import Path
import importlib.util
spec=importlib.util.spec_from_file_location('qp_feeds',Path(__file__).with_name('sync-official-feeds.py'))
feeds=importlib.util.module_from_spec(spec)
spec.loader.exec_module(feeds)

class FeedTests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory()
        self.path=Path(self.tmp.name)/'updates.json'
        self.initial={'schema':feeds.SCHEMA,'publishedAsOf':'2026-11-08','sources':[{'id':'official-0','url':'https://www.pueblo.us/'}], 'signals':[],'curatedMeetingItems':[], 'items':[], 'publicationState':'INITIAL_SOURCE_DIRECTORY_NOT_LIVE_FEED'}
        self.path.write_text(json.dumps(self.initial))
    def tearDown(self):self.tmp.cleanup()
    def test_rss_dated_metadata_not_finding(self):
        raw=b'<rss><channel><item><title>Official agenda posted</title><link>https://www.pueblo.us/1234</link><pubDate>Mon, 09 Nov 2026 07:00:00 GMT</pubDate></item></channel></rss>'
        self.assertTrue(feeds.sync(fetch=lambda url:raw,now=dt.datetime(2026,11,9,tzinfo=dt.timezone.utc),destination=self.path))
        d=json.loads(self.path.read_text())
        self.assertEqual(d['schema'],feeds.SCHEMA)
        self.assertEqual(d['sources'],self.initial['sources'])
        self.assertEqual(d['signals'],[])
        self.assertEqual(d['approvalState'],'AWAITING_EDITORIAL_REVIEW')
        self.assertEqual(d['items'][0]['status'],'source_metadata_unreviewed')
        self.assertNotIn('vote',json.dumps(d).lower())
    def test_atom_metadata(self):
        atom=b'<feed xmlns="http://www.w3.org/2005/Atom"><entry><title>Notice</title><link rel="alternate" href="https://pueblo.us/notice"/><published>2026-11-09T00:00:00Z</published></entry></feed>'
        self.assertEqual(feeds.parse_feed(atom,'City of Pueblo')[0]['title'],'Notice')
    def test_rejects_nonofficial_url_even_if_title_is_valid(self):
        data=b'<rss><channel><item><title>Fake agenda</title><link>https://pueblo.us.attacker.example/1234</link><pubDate>Mon, 09 Nov 2026 07:00:00 GMT</pubDate></item></channel></rss>'
        self.assertEqual(feeds.parse_feed(data,'City of Pueblo'),[])
        self.assertIsNone(feeds.public_url('http://pueblo.us/'))
    def test_bad_feed_preserves_prior_snapshot(self):
        original=self.path.read_bytes()
        self.assertFalse(feeds.sync(fetch=lambda url:b'not-xml',destination=self.path))
        self.assertEqual(self.path.read_bytes(),original)
    def test_rejects_legacy_schema_before_writing(self):
        self.path.write_text(json.dumps({**self.initial,'schema':'qp-public-notice-feed-v1'}))
        with self.assertRaises(ValueError):feeds.sync(fetch=lambda _:b'',destination=self.path)
        self.assertIn('qp-public-notice-feed-v1',self.path.read_text())
if __name__=='__main__':unittest.main()

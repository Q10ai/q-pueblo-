"""Offline SQLite witness for the exact endpoint reservation SQL.
Not a Cloudflare D1 integration or production test.
"""
import concurrent.futures as cf
import datetime
import pathlib
import re
import sqlite3
import tempfile
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]
SQL = re.search(r"const QUOTA_SQL = `(.*?)`;", (ROOT/"functions/api/v1/report-draft.js").read_text(), re.S).group(1)
SCHEMA = (ROOT/"security/qp-api-quota.sql").read_text()

class TestQuota(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.db = pathlib.Path(self.temp.name)/"quota.sqlite"
        with sqlite3.connect(self.db) as c:
            c.executescript(SCHEMA)
    def tearDown(self):
        self.temp.cleanup()
    def reserve(self, n, daily=8, monthly=60):
        with sqlite3.connect(self.db, timeout=30) as c:
            return c.execute(SQL, (f"{n:064x}",daily,monthly)).fetchone()
    def test_parallel_daily_limit(self):
        with cf.ThreadPoolExecutor(max_workers=16) as pool:
            hits = list(pool.map(self.reserve,range(100)))
        self.assertEqual(sum(x is not None for x in hits),8)
    def test_parallel_replay(self):
        with cf.ThreadPoolExecutor(max_workers=16) as pool:
            hits = list(pool.map(self.reserve,[7]*40))
        self.assertEqual(sum(x is not None for x in hits),1)
    def test_monthly_limit_and_prior_day_isolation(self):
        today=datetime.datetime.now(datetime.timezone.utc).date()
        # Insert dated synthetic rows from the same month (can include today).
        first=today.replace(day=1).isoformat()
        with sqlite3.connect(self.db) as c:
            c.executemany("INSERT INTO qp_api_attempts VALUES (?,?,?)",
                [(f"{i+100:064x}",first,first[:7]) for i in range(59)])
        self.assertIsNotNone(self.reserve(1,100,60))
        self.assertIsNone(self.reserve(2,100,60))
        self.assertIsNone(self.reserve(100,100,100))
    def test_old_month_does_not_reduce_current_allowance_or_allow_replay(self):
        with sqlite3.connect(self.db) as c:
            c.execute("INSERT INTO qp_api_attempts VALUES (?,?,?)",
                      (f"{8:064x}","2000-01-01","2000-01"))
        self.assertIsNone(self.reserve(8))
        for i in range(20,28): self.assertIsNotNone(self.reserve(i))
        self.assertIsNone(self.reserve(28))
    def test_failed_transaction_does_not_consume(self):
        c=sqlite3.connect(self.db)
        try:
            self.assertIsNotNone(c.execute(SQL,(f"{12:064x}",8,60)).fetchone())
            c.rollback()
        finally:c.close()
        self.assertIsNotNone(self.reserve(12))
if __name__=="__main__":unittest.main(verbosity=2)

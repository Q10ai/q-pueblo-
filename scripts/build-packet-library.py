"""Validate the curated public library without regenerating it from private drafts."""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]/"public"
reads=json.loads((ROOT/"data/qp-featured-reads-2026-11-14.json").read_text())["reads"]
case=json.loads((ROOT/"data/q-pueblo-public-case-summaries.json").read_text())["caseSummaries"]
page=(ROOT/"packets.html").read_text()
assert len(reads)==20 and len(case)==8
assert not (ROOT/"data/q-pueblo-historical-library-2026-11-10.json").exists()
for row in reads:
    assert row["href"] in page
for row in case:
    assert (ROOT/row["localDownload"]).is_file()
    assert row["localDownload"] in page
assert "gamma.app/docs/" not in page
print("Public library validated; approved layout left unchanged.")

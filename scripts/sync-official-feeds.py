#!/usr/bin/env python3
"""Create a human-reviewable metadata snapshot from strictly approved official feeds.

No public post, meeting finding, personal data or model training is authorized here.
This module intentionally leaves original source directories and their status intact.
"""
import datetime as dt
import hashlib
import json
from pathlib import Path
from urllib.parse import urlparse
from urllib.request import Request, urlopen
from email.utils import parsedate_to_datetime
import xml.etree.ElementTree as ET

BASE = Path(__file__).resolve().parents[1]
OUT = BASE / 'public' / 'data' / 'updates.json'
SOURCE_LIST = (
    ('City of Pueblo — public meetings', 'https://www.pueblo.us/RSSFeed.aspx?CID=Public-Meetings-48&ModID=58'),
    ('City of Pueblo — official news', 'https://www.pueblo.us/RSSFeed.aspx?CID=Home-1&ModID=1'),
)
ALLOWED = frozenset({'www.pueblo.us', 'pueblo.us', 'pueblo.granicus.com', 'pueblowestmetro.us', 'www.pueblowestmetro.us'})
ATOM = '{http://www.w3.org/2005/Atom}'
SCHEMA = 'qp-official-source-watch-v1'


def norm_date(value):
    if not value:
        return None
    try:
        stamp = parsedate_to_datetime(value)
    except (ValueError, TypeError, IndexError, OverflowError):
        try:
            stamp = dt.datetime.fromisoformat(value.replace('Z', '+00:00'))
        except (ValueError, TypeError, OverflowError):
            return None
    if stamp.tzinfo is None:
        stamp = stamp.replace(tzinfo=dt.timezone.utc)
    return stamp.astimezone(dt.timezone.utc).isoformat().replace('+00:00', 'Z')


def public_url(value):
    try:
        val = value.strip()
        url = urlparse(val)
        return val if (url.scheme == 'https' and url.hostname in ALLOWED and not url.username and not url.password and url.port in (None, 443)) else None
    except (ValueError, TypeError, AttributeError):
        return None


def parse_feed(raw, publisher):
    root = ET.fromstring(raw)
    result = []
    if root.tag == 'rss':
        for n in root.findall('./channel/item'):
            result.append((n.findtext('title'), n.findtext('link'), n.findtext('pubDate')))
    elif root.tag == ATOM + 'feed':
        for n in root.findall(ATOM + 'entry'):
            links = n.findall(ATOM + 'link')
            link = next((e.attrib.get('href') for e in links if e.attrib.get('rel', 'alternate') == 'alternate'), None)
            result.append((n.findtext(ATOM + 'title'), link, n.findtext(ATOM + 'published') or n.findtext(ATOM + 'updated')))
    else:
        raise ValueError('unsupported official feed schema')
    items = []
    for title, url, date in result:
        title = ' '.join((title or '').split())[:150]
        url = public_url(url or '')
        date = norm_date(date)
        if not title or not url or not date:
            continue
        id_ = 'official-' + hashlib.sha256((publisher + '|' + url).encode()).hexdigest()[:18]
        items.append({'id': id_, 'title': title, 'publisher': publisher, 'kind': 'official_feed_item',
                      'publishedAt': date, 'url': url, 'status': 'source_metadata_unreviewed'})
    return items


def sync(fetch=None, now=None, destination=OUT):
    """Returns True on at least one valid feed; writes only a review-queue candidate.

    Never alters the 'sources', 'signals', or 'curatedMeetingItems' fields.
    False means prior snapshot remains untouched.
    """
    now = now or dt.datetime.now(dt.timezone.utc)
    existing = json.loads(destination.read_text(encoding='utf-8'))
    if existing.get('schema') != SCHEMA:
        raise ValueError('unexpected notice schema: preserve prior file')
    if not isinstance(existing.get('sources'), list) or not isinstance(existing.get('signals'), list):
        raise ValueError('source directory structure missing')
    fetch = fetch or (lambda url: urlopen(Request(url, headers={
        'User-Agent': 'QPuebloOfficialFeedMonitor/1.0 (public metadata; no autonomous conclusions)',
        'Accept': 'application/rss+xml,application/atom+xml,application/xml'}), timeout=20).read(1_500_001))
    new, ok = [], 0
    for publisher, url in SOURCE_LIST:
        try:
            raw = fetch(url)
            if len(raw) > 1_500_000:
                raise ValueError('oversize feed')
            rows = parse_feed(raw, publisher)
            if not rows:
                print('WARNING: no dated allowlisted entries from', publisher)
                continue
            ok += 1
            new.extend(rows)
        except (Exception,) as exc:
            print('WARNING:', publisher, type(exc).__name__, str(exc)[:120])
    if ok == 0:
        print('No usable publisher feed. Prior public metadata snapshot preserved.')
        return False
    by_id = {i['id']: i for i in existing.get('items', []) if i.get('status') == 'source_metadata_unreviewed'}
    by_id.update({i['id']: i for i in new})
    fresh = sorted(by_id.values(), key=lambda i: i['publishedAt'], reverse=True)[:60]
    candidate = {**existing, 'items': fresh,
                 'lastSuccessfulSourceCheck': now.isoformat().replace('+00:00', 'Z'),
                 'publicationState': 'SOURCE_METADATA_REQUIRES_HUMAN_EDITORIAL_REVIEW',
                 'approvalState': 'AWAITING_EDITORIAL_REVIEW'}
    if candidate != existing:
        destination.write_text(json.dumps(candidate, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
        print('REVIEW_CANDIDATE', len(fresh), 'attributed official-feed titles; NOT a verified meeting report')
    return True


if __name__ == '__main__':
    if not sync():
        raise SystemExit(2)

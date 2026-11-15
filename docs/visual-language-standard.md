# Q-Pueblo visual language and explanatory media — v0.1
Status: review candidate. Preserve existing illustration family; no new brand or arbitrary icon mixing.
## Core style
- Reuse public/assets/pueblo-entry-art.webp and pueblo-report-art.webp and their existing class positions for relevant current entryways. Do not relabel meaningful artwork as a different subject. New header art must match existing approved artwork in silhouette, composition, lighting and palette; inspect rendered comparison before acceptance.
- Existing visual tokens: navy #091e38, steel blue #153a54, purple #292757, gold #d5a862, turquoise #72c9c4, light text #e9f4ff. Preserve existing typography and card geometry. Design one consistent SVG utility icon family (24x24 viewBox, rounded stroke, consistent stroke width, accessible adjacent labels), distinct from editorial illustrations. Never use mismatched emoji as the primary navigation icons. Legacy exceptions such as Rumor Mill vent art may be replaced by a matching original illustration after review.
## Visuals by intent
- Story timelines: dated event and action cards, no connecting line implying causality.
- Follow the Money: exact same-scope part-to-whole bars, comparable time-series, flow arrows labeled proposed/authorized/committed/paid/outcome. No money-stage addition.
- Who & What: typed connections with accessible table, source and date, no speculative influence rankings.
- Infrastructure: project-stage path, route/section sketches, before-and-after only with compatible time/location and licensed evidence.
- Nature: seasonal field guide, watershed and habitat diagrams, food webs, habitat illustrations; no sensitive species locations.
- RX/BACKUP/LEAP: scenario sliders, assumption/range/unit labels; illustrate conditional failure paths rather than forecasts.
- Learn & Play: optional original Q field-guide characters (prairie dog, magpie or a small lantern-shaped Q helper as concepts only); educational hints, read-along, labeled diagrams and micro quizzes. Avoid infantilizing adult and consequential stories. Rumor Mill: a humorous steam icon/character can offer private reflection, never diagnose or shame.
- Mobile-first progressive disclosure: expandable footnotes, source drawers, chapter jump list, tap-to-reveal terms, date-based story comparison, map/list toggle, printable tables. No autoplay, tracking or remote generative calls.
## Motion and performance
Prefer static SVG and CSS, compressed existing WebP artwork, native details/meter and user-initiated brief transitions. No persistent animation, parallax or flashing. Support prefers-reduced-motion, keyboard, touch, accessible text/table equivalents, visible focus and contrast. Do not claim WCAG conformance until tested. Check 320px, tablet and desktop, forced colors, screen readers, offline behaviour and Core Web Vitals. W3C https://www.w3.org/TR/WCAG22/ and https://www.w3.org/WAI/WCAG22/Techniques/css/C39.html.
## Evidence contract
Every graphic has title, source locator, observation date, units, scope, denominator where needed, stage, uncertainty and textual equivalent. Suppress invalid mixed/duplicate/unknown data rather than produce a persuasive graphic. Distinguish artwork, documented photos, historical reconstructions and scenarios. No invented values. Never let visual status imply a verified real-world outcome.
## Initial implementation
Shared investigative story view renders two native-meter visualizations derived from existing public fact records: August 2026 county priority statuses and May 13 Half-Cent fund classifications. Explicit labels, one source per group, sum-to-total check and readback of values; no extra dependencies. New visual guide and character concepts are proposed, not completed illustration assets. No production release or browser/accessibility validation yet.

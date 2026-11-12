# Q-Pueblo design and publication QA

final result: blocked

## Source visual target

Owner-supplied 1000024931.png (1536×1024 desktop design reference) and
1000024932.png (1536×512 logo banner). Original public content and owner instructions
preserve current capabilities and require desktop/mobile usability.

## Implemented

Supplied banner, unified navy/purple theme, gold/turquoise accents, licensed local
Phosphor icons, eleven original illustrated topic images, report thumbnails and
community/child-impact panels. Thumbnails are bounded to 800px and total about
1.3MB. Twenty HTML pages load the shared theme. Responsive CSS targets 320px,
390px, tablet and desktop widths, with menu and grid changes and 44px controls.

## Required visual evidence — blocked

The local server responds with the real homepage inside the preview runtime.
The cloud browser's required terminal.local:4173 relay consistently responds
“upstream connect error or disconnect/reset before headers”. Both the standard
preview startup and a minimal static server were attempted. No rendered
implementation screenshot could be captured, so no side-by-side comparison,
desktop/mobile interaction claim, or visual approval is made.

Implementation screenshot path: unavailable (relay failure).
CSS viewport/density: unmeasured in the browser. Planned checks: 1536px desktop,
768px tablet, 390px and 320px phone widths, CSS pixels at deviceScaleFactor 1.
State: homepage; mobile closed/open navigation; reports and calculator routes.
Full-view and focused comparisons: blocked, no fabricated visual evidence.

## Fidelity surfaces

- Typography: original readable system/serif typography retained; final wrapping
  and optical sizing need browser review against the condensed reference.
- Layout: desktop dashboard and responsive grids implemented; overflow and touch
  layouts need actual browser inspection.
- Colors: navy #080d29, purple #8356c7, gold #ffda83, turquoise #7ce9e2;
  final rendered contrast/focus states need inspection.
- Imagery: supplied banner unaltered, real generated illustrative artwork and
  MIT-licensed icons; no emoji placeholders or fabricated civic data images.
- Copy: existing dated evidence retained; unsupported live-automation assertions
  from the reference are excluded. Public report count corrected from 3 to 14.

## Findings and implementation checklist

1. [P1] Required browser verification is blocked by the preview relay. Restore
   the relay, capture desktop and mobile, inspect image loads, menu behavior,
   horizontal overflow, Qify search, report selection and EE calculator output.
2. [P2] Compare major-region proportions, spacing and typography with the owner
   reference at an equal viewport; fix material drift before visual approval.
3. Inspect focus visibility, image crops, text contrast, and print views.
4. Check console errors and re-run source checks after any fixes.
5. Only then change final result to passed and authorize production publication.

## Checks completed

Public integrity/link/editorial checks and release safety tests are recorded in
local command output and hosted CI when available. They do not replace browser
QA or live Cloudflare readback. No production deployment is claimed.

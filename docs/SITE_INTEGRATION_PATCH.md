# Q-Pueblo controlled navbar and public routes

The existing homepage in `public/index.html` should retain its unchanged inline steel-mill Q, hero styling, search, issue index, and user-facing sections. This PR adds only a reviewed navigational entry to `public/learn/` and `public/explore/` after staging route and browser acceptance. Navigation changes must be tested against the existing `public/site.js` event delegation and responsive menu before merge.

**Home navigation:** `Learn` → `/learn/`, `Wiki · VISOR` → `/explore/`.

**Gates:** verify original brand kit and hardened candidate assets; review authorized exact release manifest; confirm no protected data exposed; test website root plus both routes in preview Cloudflare environment, including 320px mobile header; require named-human publication approval and rollback. `qpueblo.pages.dev` remains separate from the private Q10 research/canonical source.

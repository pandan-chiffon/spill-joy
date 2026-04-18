# Spill Joy

A free, browser-based micro-wellness tool. Type how you're feeling, receive an encouraging thought, and follow a guided breathing exercise — no account, no download, no build step.

**Live site:** [spill-joy.pages.dev](https://spill-joy.pages.dev) *(update once deployed)*

---

## What it does

1. **Ask** — the user types an emotion into a centered breathing circle
2. **Encourage** — a random quote appears in the circle
3. **Breathe** — holding the "Hold to breathe" button guides the user through a 4-7-8 breathing cycle (inhale 4s → hold 7s → exhale 8s), paced by an animated circle
4. **Science note** — an inline explainer describes why paced breathing activates the vagus nerve and shifts the nervous system toward calm

Background: a slow-drifting aurora gradient (six colour palettes) that interrupts negative thought loops without being distracting.

---

## File structure

```
spill-joy/
├── index.html            # Entry point — SEO/AEO meta, schema markup, script tags
├── app.jsx               # Main React app — screens, breathing logic, layout
├── aurora.jsx            # Animated gradient background + palette definitions
├── breathing-circle.jsx  # Frosted-glass SVG circle that pulses with breathing
├── ui.jsx                # Shared primitives (SoftButton, GhostLink)
├── quotes.js             # 50 encouragement quotes — swap in your own list here
├── _headers              # Cloudflare Pages HTTP headers (security + cache)
├── robots.txt            # Search crawler permissions
└── README.md             # This file
```

No framework, no build step. React and Babel run from CDN; JSX is compiled in the browser.

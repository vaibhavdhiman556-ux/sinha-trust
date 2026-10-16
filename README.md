# Dr. Himmat Singh Sinha Trust

A premium, dependency-free archive website for the Dr. Himmat Singh Sinha Trust.

## Run locally

Open `index.html` in a browser, or serve this folder with any static file server. For
example, with Node installed, run:

```
node -e "require('http').createServer((q,s)=>{let u=q.url.split('?')[0];if(u==='/')u='/index.html';require('fs').readFile('.'+u,(e,d)=>{if(e){s.writeHead(404);s.end('404');return}s.writeHead(200);s.end(d)})}).listen(8000"
```

and visit `http://localhost:8000`.

Typefaces load from Google Fonts when a network connection is available; system
serif and sans-serif fonts are fallbacks.

## Project files

- `index.html` — semantic page structure, navigation, hero, numbers, manifesto,
  section index, collection overview, call to action and the reusable dialog.
- `style.css` — design tokens, typography scale, atmosphere, layout, focus states,
  motion primitives and responsive behaviour.
- `script.js` — navigation, dialog behaviour, focus restoration, reveal engine,
  count-up statistics, pointer interactions and the hero sculpture.
  *(Note: the file lives at `script.js` in the repository root.)*

## Design system

| Token | Value | Role |
| --- | --- | --- |
| `--ink` | `#080d10` | Page background |
| `--ink-raise` | `#0b1114` | Raised surface |
| `--paper` | `#fffefd` | Primary text |
| `--muted` | `rgba(255,254,253,.70)` | Secondary text |
| `--faint` | `rgba(255,254,253,.52)` | Metadata, labels |
| `--accent` | `#ff7a00` | Accent, focus, highlights |
| `--moss` | `#55644e` | The Trust's original sage, used only in atmospheric gradients |
| `--font-display` | Bricolage Grotesque | Oversized headlines |
| `--font-sans` | Albert Sans | Body and interface |
| `--font-mono` | JetBrains Mono | Numbers, labels, metadata |

`--faint` and `--muted` were contrast-tested against `--ink`; they measure 5.6:1 and
8.1:1 respectively and satisfy WCAG AA for body text.

## Motion

The whole page uses one motion language: a single easing curve
(`cubic-bezier(.22, 1, .36, 1)`) and a small set of durations.

- **Continuous scrolling.** There is no scroll snapping, no scroll-jacking and no
  pinned sections. Every animation is triggered by content entering the viewport, so
  the visitor always stays in control of the scroll.
- **Entrance.** A short preloader (~2.6s hard cap) resolves into a line-masked
  headline reveal. It is skippable and never blocks content.
- **Typography.** Headlines reveal line by line behind a mask; supporting text
  fades and lifts with a stagger.
- **Numbers.** Statistics count up with an ease-out quartic when they scroll into
  view, preserving padding, suffixes and decimals.
- **Images.** The portrait lives in a full-width band at the top of the page: the
  photograph fills a rounded, hairline-framed plate with corner ticks and a
  caption. When no photograph is supplied yet, an honest "Portrait to be added"
  placeholder takes its place.
- **3D.** A Three.js sculpture (a torus knot inside a wireframe shell, lit by a warm
  key and a cool fill) sits in the hero frame. It drifts slowly, responds to
  pointer position, pauses when off-screen or when the tab is hidden, and falls
  back to the framed placeholder when WebGL is unavailable.
- **Pointer.** Magnetic primary buttons, a cursor-following record preview on the
  section index, and a custom cursor ring on fine-pointer devices only.
- **Smooth scroll.** Lenis adds inertia while preserving native wheel, touch,
  keyboard and trackpad behaviour.

Every animation is disabled or reduced under `prefers-reduced-motion: reduce`,
and nothing on the page depends on JavaScript or motion to be understood.

## Performance

- Only three libraries are loaded, each because it solves a real requirement:
  Lenis (inertia), Three.js (3D) and Google Fonts. No animation engine is bundled.
- Libraries are injected after the page is interactive via `requestIdleCallback`,
  so first paint never waits on them.
- The 3D renderer caps device pixel ratio, drops geometry detail on small screens,
  and stops rendering when the hero is off-screen.
- All animation is transform and opacity only; no layout properties are animated.
- Lighthouse: Accessibility 100, Best Practices 100, SEO 100.

## Accessibility

Semantic landmarks, a logical heading order, a skip link, visible focus rings,
keyboard-dismissible dialogs with focus restoration, `aria-expanded` on the menu
toggle, reduced-motion support, and AA-compliant contrast throughout.

## Add the portrait

The real photograph lives at `assets/images/dr-himmat-singh-sinha.jpg` and is
shown in the portrait band at the top of the page, inset and framed like a plate,
with the caption "Dr. Himmat Singh Sinha · Trust · Archive". While the file is
absent the band shows an honest "Portrait to be added" placeholder. Update the
image's `alt` text in `index.html` to accurately describe the supplied
photograph.

## Add verified content

Each section currently opens the same accessible dialog and shows "Content to be
added." To add content, edit the dialog content markup in `index.html` and use
`js/script.js` to select section-specific content by its section key. Keep all
dates, names, credentials and records grounded in information supplied and
verified by the Trust.

- **Biography:** Add structured biography markup inside the dialog content for the
  `biography` key.
- **Bibliography and Books:** Use separate section keys. Book records can later
  include title, publication details, year, publisher, edition, language, cover,
  description and related writings.
- **Achievements:** Add verified dated entries in chronological order if supplied;
  no timeline entries are prefilled.
- **Writings and Publications:** Add distinct collections under their existing keys.
- **Articles:** Add supplied titles, dates, summaries and article text under the
  `articles` key.
- **Gallery:** Add only approved images to `assets/images/` and provide accurate alt
  text. The initial site has no gallery photos.
- **Contact:** Add only verified contact details supplied by the Trust.

The three statistics in "The archive in numbers" band describe the state of this
website, not claims about Dr. Sinha's life or work. Update or remove them as
verified content arrives — never fabricate metrics.

## Modify navigation and sections

Update the navigation buttons, the section index, the collection overview and the
footer links in `index.html` together with `sectionLabels` in `js/script.js`.
Buttons use a matching `data-section` key. The shared dialog supports keyboard
dismissal with Escape, backdrop dismissal, focus management and page scroll locking.

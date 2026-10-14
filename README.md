# Dr. Himmat Singh Sinha Trust

A responsive, dependency-free website starter. Biographical and Trust information is intentionally left empty until verified content is supplied.

## Run locally

Open `index.html` in a browser, or serve this folder with any static file server. For example, with Python installed, run `python -m http.server 8000` from this folder and visit `http://localhost:8000`.

The typefaces load from Google Fonts when a network connection is available; system serif and sans-serif fonts are fallbacks.

## Project files

- `index.html` contains the semantic page structure, navigation, hero and reusable dialog.
- `css/style.css` contains the palette, typography, responsive layout, focus states and motion preferences.
- `js/script.js` contains the navigation, dialog behavior, focus restoration and section labels.
- `assets/images/` is reserved for the supplied portrait and future gallery assets.

## Add the portrait

Place the supplied photograph at `assets/images/dr-himmat-singh-sinha.jpg`. The hero already references this path and uses `object-fit: cover` without stretching. If the file is absent, an understated placeholder appears instead of a broken image. Update the image's `alt` text in `index.html` to accurately describe the supplied photograph.

## Add verified content

Each section currently opens the same accessible dialog and shows “Content to be added.” To add content, edit the dialog content markup in `index.html` and use `js/script.js` to select section-specific content by its section key. Keep all dates, names, credentials and records grounded in information supplied and verified by the Trust.

- **Biography:** Add structured biography markup inside the dialog content for the `biography` key.
- **Bibliography and Books:** Use separate section keys. Book records can later include title, publication details, year, publisher, edition, language, cover, description and related writings.
- **Achievements:** Add verified dated entries in chronological order if supplied; no timeline entries are prefilled.
- **Writings and Publications:** Add distinct collections under their existing keys.
- **Articles:** Add supplied titles, dates, summaries and article text under the `articles` key.
- **Gallery:** Add only approved images to `assets/images/` and provide accurate alt text. The initial site has no gallery photos.
- **Contact:** Add only verified contact details supplied by the Trust.

## Modify navigation and sections

Update the navigation buttons and section cards in `index.html` together with `sectionLabels` in `js/script.js`. Buttons use a matching `data-section` key. The shared dialog supports keyboard dismissal with Escape, backdrop dismissal, focus management and page scroll locking.

# Petasus AI Cloud on GoAT

Landing page for **Petasus AI Cloud on GoAT**: SK Telecom's Petasus AI Cloud running NTT DOCOMO
BUSINESS's GPU over APN Testbed (GoAT). The page is supporting information for the GLOMO Awards
2027 entry in category 1.g, Best Cloud Solution.

It is a plain static site (HTML, CSS and a little JavaScript) with no build step, hosted on
GitHub Pages.

## Layout

```
.
├── .github/workflows/pages.yml   Deploys site/ to GitHub Pages
├── site/                         Published as-is; nothing outside this folder goes live
│   ├── index.html
│   └── assets/
│       ├── css/style.css
│       ├── js/main.js            Map highlighting and the architecture walk-through
│       ├── fonts/                Inter (subset) and its license, OFL.txt
│       └── img/                  Petasus AI Cloud and SK Telecom logos
├── scripts/build_standalone.py   Builds a single self-contained HTML file
├── LICENSE
└── THIRD_PARTY_NOTICES.md
```

## Preview locally

```sh
python3 -m http.server 8000 -d site
```

Then open <http://localhost:8000>. Serving the folder matches what GitHub Pages does more
closely than opening `site/index.html` from disk.

## Deploy

Every push to `main` that changes `site/` (or the workflow) publishes the site through
[`.github/workflows/pages.yml`](.github/workflows/pages.yml). You can also run the workflow by
hand from the **Actions** tab.

One-time setup, done by a repository admin:

1. **Settings → Pages → Build and deployment → Source**: choose **GitHub Actions**.
2. Push to `main`, or run the workflow once.

The site is then at <https://petasus-ai.github.io/glomo/>, unless the organization has a custom
domain for its Pages sites. To use a custom domain for this site, set it under
**Settings → Pages → Custom domain**; no `CNAME` file is needed with Actions-based deployment.

## Editing notes

- All asset paths are relative (`assets/...`), so the site works both under `/glomo/` and on a
  custom domain. Keep new links relative.
- The Inter font is a subset that covers only the characters the page uses today. Characters
  added later that fall outside it (accented letters, Japanese, new symbols) render in the
  system fallback font. Re-subset Inter 4.x from <https://github.com/rsms/inter> if that matters.
- `site/` is uploaded whole, so anything placed there becomes public.
- The page asks search engines not to index it (`<meta name="robots" content="noindex, ...">` in
  `index.html`). Don't add a `robots.txt` that disallows the page: crawlers would then never
  fetch it, never see the `noindex`, and could still list the bare URL. A `robots.txt` under
  `/glomo/` is ignored anyway; crawlers read it only at the domain root.

## Single-file version

For offline viewing or sending the page as one attachment:

```sh
python3 scripts/build_standalone.py
```

This writes `dist/petasus-ai-cloud-goat.html` with the CSS, script, font and logos inlined.
`dist/` is not committed.

## License

Copyright © 2026 SK Telecom Co., Ltd. All rights reserved; see [LICENSE](LICENSE). The Inter
font is licensed separately under the SIL Open Font License 1.1; see
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

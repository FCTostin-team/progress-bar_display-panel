# FCT Progress Bar Display Panel

[![Version](https://img.shields.io/badge/version-v5.0-4c1?style=for-the-badge)](#)
[![License: GPL-3.0](https://img.shields.io/badge/License-GPL--3.0-blue?style=for-the-badge)](LICENSE)
[![Platform: Web](https://img.shields.io/badge/platform-webapp-0a7?style=for-the-badge)](#technology-stack)
[![Language Packs](https://img.shields.io/badge/i18n-12_languages-8a2be2?style=for-the-badge)](#features)

A production-ready, browser-based utility for building and tweaking Factorio `progress_bar` display-panel blueprints with instant JSON editing, gradient controls, and one-click blueprint encoding.

> [!IMPORTANT]
> This project is a static frontend app. No backend, no server-side rendering, no vendor lock-in. Just clone, open, and ship.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Technical Block](#technical-block)
  - [Project Structure](#project-structure)
  - [Key Design Decisions](#key-design-decisions)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Usage](#usage)
- [Configuration](#configuration)
- [License](#license)
- [Community and Support](#community-and-support)
- [Support the Development](#support-the-development)
- [Contacts](#contacts)

## Features

- **Blueprint profile selector** for quickly switching between curated `progress_bar` presets.
- **Item selector with live icon preview** so you immediately see the selected in-game item target.
- **Gradient builder** with configurable point count and real-time preview.
- **Font selector** mapped to Factorio-compatible font IDs.
- **JSON editor with search and navigation** (`find`, `next`, `prev`) for fast low-level tuning.
- **Encoder pipeline** that serializes edited JSON into a ready-to-use encoded blueprint string.
- **Copy-to-clipboard action** for immediate in-game paste workflow.
- **Internationalization support** with multiple locale packs (including EN, RU, UK, KK, CS, NL, SV, DE, PL, FR, ZH, JA).

> [!TIP]
> The fastest workflow is: pick profile -> pick item -> tune gradient/font -> patch JSON -> encode -> copy.

## Technology Stack

Core stack:

- **HTML5** for layout and semantic structure.
- **CSS3** for visual styling and panel layout.
- **Vanilla JavaScript (ES6+)** for app logic, state updates, encoding flow, and i18n runtime switching.
- **Static JSON/JS data modules** for blueprint data, item lists, fonts, and locale dictionaries.

No framework abstractions are used, which keeps the runtime lightweight and easy to debug in-browser.

## Technical Block

### Project Structure

```text
.
├── index.html          # Main app shell and UI sections
├── style.css           # Full UI styling, layout, and responsive behavior
├── script.js           # Runtime logic: UI events, editor, encoding, state sync
├── data.js             # Blueprint, item, and font datasets
├── profiles/           # Locale dictionaries (en, ru, uk, ...)
├── CODE_OF_CONDUCT.md  # Community behavior standards
├── LICENSE             # GPL-3.0 license text
└── README.md
```

### Key Design Decisions

- **Static-first architecture**: the app is intentionally framework-free to reduce operational overhead and make hosting trivial.
- **Client-side processing**: all blueprint manipulation happens in the browser; user data does not leave the client.
- **Locale modularity**: translations are stored per-language in `profiles/*.js`, making i18n updates straightforward.
- **Editable JSON surface**: power users can bypass UI-only limits and patch payloads directly.

> [!NOTE]
> This repo favors maintainability and low friction over introducing a complex build chain.

## Getting Started

### Prerequisites

Minimum runtime requirements:

- A modern browser (`Chrome`, `Firefox`, `Edge`, `Safari`).
- Optional: `Python 3` or `Node.js` if you want to run a local static server (recommended).
- Optional for contributions: `Git`.

### Installation

```bash
# 1) Clone the repo
git clone https://github.com/<your-org>/progress-bar_display-panel.git

# 2) Enter project directory
cd progress-bar_display-panel

# 3) Quick-start (direct open)
# Linux
xdg-open index.html
# macOS
open index.html
# Windows (PowerShell)
start index.html
```

Recommended local server mode:

```bash
# Option A: Python static server
python -m http.server 8080
# then open http://localhost:8080

# Option B: Node-based static server (if installed)
npx serve .
```

> [!WARNING]
> Opening files via `file://` works for most flows, but some browsers enforce stricter local policies. If something looks off, use a local server.

## Testing

There is currently no formal automated unit/integration suite in this repository.

Use this pragmatic validation checklist before merging:

```bash
# 1) Verify the app loads with no red errors
# Open DevTools Console and confirm clean startup

# 2) Smoke-test full main flow
# Select profile -> item -> gradient -> font -> edit JSON -> encode -> copy

# 3) Validate i18n switching
# Change language selector and check core labels

# 4) Optional syntax sanity check
node --check script.js
node --check data.js
```

If you are adding behavior in `script.js`, include reproducible manual test steps in the PR description.

## Deployment

Because this is a static web app, deployment is straightforward.

### Option 1: GitHub Pages

1. Push changes to `main` (or your configured Pages source branch).
2. Enable Pages in repository settings.
3. Set source to root folder.
4. Publish and validate output URL.

### Option 2: Netlify / Vercel / Cloudflare Pages

- Import repository.
- Build command: **none required**.
- Publish directory: repository root (`.`).

### Option 3: Docker + Nginx (self-host)

```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80
```

```bash
docker build -t progress-bar-panel .
docker run -p 8080:80 progress-bar-panel
```

## Usage

Typical operator flow:

```text
1) Select a blueprint preset.
2) Select target item.
3) Configure gradient points/colors.
4) Pick the font.
5) Fine-tune payload in JSON editor.
6) Click Encode.
7) Copy encoded blueprint string.
8) Paste into Factorio.
```

Advanced JSON patching example:

```js
// pseudo-workflow in editor
// update visual text prototype
"text": "Iron throughput"

// retarget display product
"product": "iron-plate"

// tune color stops in gradient block
"colors": ["#00ff00", "#ffff00", "#ff0000"]
```

> [!CAUTION]
> Invalid JSON or malformed blueprint structure will break encoding. Keep edits atomic and re-encode often.

## Configuration

This project does not require `.env` by default.

Configuration surfaces are file-based:

- `data.js`: blueprint presets, selectable products/items, fonts.
- `profiles/*.js`: localization strings.
- `index.html`: base UI composition and labels.
- `style.css`: visual theme and layout behavior.

Suggested contributor pattern:

```bash
# Add new locale pack
cp profiles/en.js profiles/<new-lang>.js
# Register new language option in index.html
# Wire dictionary loading in script.js (if needed)
```

## License

Distributed under the **GNU GPL-3.0** License. See [`LICENSE`](LICENSE) for full legal text.

## Community and Support

Project created with the support of the FCTostin community.

[![YouTube](https://img.shields.io/badge/YouTube-Channel-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://www.youtube.com/@FCT-Ostin)
[![Telegram](https://img.shields.io/badge/Telegram-Join_Chat-26A5E4?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/FCTostin)
[![Steam](https://img.shields.io/badge/Steam-Join_Group-1b2838?style=for-the-badge&logo=steam&logoColor=white)](https://steamcommunity.com/groups/FCTgroup)

## Support the Development

[![Patreon](https://img.shields.io/badge/Patreon-Support-F96854?style=for-the-badge&logo=patreon&logoColor=white)](https://www.patreon.com/c/OstinFCT)
[![Boosty](https://img.shields.io/badge/Boosty-Donate-F15F2C?style=for-the-badge&logo=boosty&logoColor=white)](https://boosty.to/ostinfct)

## Contacts

- Community updates and releases: YouTube / Telegram links above.
- Bug reports and feature proposals: open a GitHub Issue.
- Contribution process: see [`CONTRIBUTING.md`](CONTRIBUTING.md).

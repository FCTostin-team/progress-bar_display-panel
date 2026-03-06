# Contributing Guide

First off: huge thanks for considering a contribution. If you’re here, you’re helping make this tool sharper for the entire Factorio builder ecosystem.

This document is the operational playbook for contributing code, docs, and ideas to `progress-bar_display-panel`.

## 1) Introduction

We welcome:

- Bug fixes
- UX improvements
- New locale packs
- Data/profile updates
- Refactors that reduce complexity without changing behavior
- Documentation improvements

If you want to submit a change, awesome. Keep it focused, reproducible, and review-friendly.

## 2) I Have a Question

Please do **not** use GitHub Issues for general usage questions.

Issues are reserved for:

- Defects
- Regressions
- Trackable feature work

For questions, use community channels:

- Telegram chat: https://t.me/FCTostin
- YouTube community touchpoints: https://www.youtube.com/@FCT-Ostin
- Steam group: https://steamcommunity.com/groups/FCTgroup

If you ask in community channels, include screenshots and the exact blueprint/action you’re trying to perform.

## 3) Reporting Bugs

High-signal bug reports get fixed faster. Before opening a bug:

1. Search existing Issues for duplicates.
2. Re-test on latest `main`.
3. Collect runtime context.

### Bug Report Template (Recommended)

```md
## Summary
Short description of the bug.

## Environment
- OS: (e.g. Windows 11 / Ubuntu 24.04 / macOS 14)
- Browser + version: (e.g. Chrome 124)
- App version/commit: (e.g. v5.0 / commit SHA)

## Steps to Reproduce
1. Go to ...
2. Select ...
3. Edit ...
4. Click ...

## Expected Behavior
What should happen.

## Actual Behavior
What actually happens.

## Reproducibility
Always / Sometimes / Rarely

## Artifacts
Console errors, screenshots, problematic JSON snippet.
```

> [!IMPORTANT]
> If there is a JSON-related bug, include the minimal JSON fragment that reproduces it.

## 4) Suggesting Enhancements

Feature requests are welcome, but keep them grounded.

A strong enhancement proposal includes:

- **Problem statement**: what pain this solves.
- **Proposed solution**: expected UX/behavior.
- **Use cases**: real scenarios from Factorio workflow.
- **Trade-offs**: any complexity, performance, or maintenance costs.

Low-context “please add X” requests are hard to prioritize. Bring data, examples, and expected outcomes.

## 5) Local Development / Setup

### Fork + Clone

```bash
# 1) Fork on GitHub, then clone your fork
git clone https://github.com/<your-username>/progress-bar_display-panel.git
cd progress-bar_display-panel

# 2) Add upstream remote
git remote add upstream https://github.com/<upstream-org>/progress-bar_display-panel.git
```

### Run Locally

```bash
# Option A: direct open
open index.html        # macOS
xdg-open index.html    # Linux
start index.html       # Windows PowerShell

# Option B: static server (recommended)
python -m http.server 8080
# then open http://localhost:8080
```

### Optional Node Syntax Check

```bash
node --check script.js
node --check data.js
```

> [!NOTE]
> No `.env` setup is required in the current architecture.

## 6) Pull Request Process

### Branch Naming Strategy

Use one of these patterns:

- `feature/<short-feature-name>`
- `bugfix/<issue-id-or-scope>`
- `docs/<scope>`
- `refactor/<scope>`

Examples:

- `feature/add-japanese-tooltip-fixes`
- `bugfix/issue-42-encode-null-guard`
- `docs/readme-refresh`

### Commit Message Convention

Use **Conventional Commits**:

- `feat: add language fallback for missing locale keys`
- `fix: prevent encode on invalid json payload`
- `docs: rewrite setup and deployment sections`
- `refactor: simplify gradient state synchronization`

### Sync Before Opening PR

```bash
git fetch upstream
git checkout main
git rebase upstream/main
```

Then rebase your feature branch on updated `main`.

### PR Description Checklist

Every PR should include:

- Linked Issue(s), if available (`Closes #123`)
- What changed and why
- Before/after behavior notes
- Manual test steps
- Screenshots for UI changes

> [!WARNING]
> PRs without reproducible test steps may be delayed in review.

## 7) Styleguides

This repo is plain HTML/CSS/JS. Keep it lean and readable.

### JavaScript

- Prefer small pure helpers where possible.
- Avoid hidden side effects in UI handlers.
- Keep naming explicit and domain-relevant.
- Don’t introduce heavy dependencies for trivial tasks.

### HTML/CSS

- Preserve semantic structure and current UI architecture.
- Keep classes and selectors consistent with existing conventions.
- Avoid unnecessary layout churn in unrelated areas.

### Linters / Formatters

There is currently no enforced lint pipeline in-repo.

Suggested local tooling (optional but recommended):

- `Prettier` for formatting
- `ESLint` for JS static checks

If you run tools, avoid formatting unrelated files in the same PR.

## 8) Testing

New behavior should include validation evidence.

At minimum, verify:

- Main flow still works end-to-end.
- JSON editor search/navigation still functions.
- Encode/copy flow remains stable.
- Language switch still updates key UI labels.

Suggested commands:

```bash
# Run local static host
python -m http.server 8080

# Optional syntax checks
node --check script.js
node --check data.js
```

For bug fixes, include a deterministic repro and confirmation that the patch closes it.

## 9) Code Review Process

- Maintainers review incoming PRs.
- Typical merge target is `main`.
- At least one maintainer approval is expected before merge.
- If reviewers leave feedback, push follow-up commits or amend and force-push (if requested).

Best practices during review:

- Respond to every review thread.
- Keep discussion technical and concrete.
- Mark threads resolved only after code is updated.

Thanks again for contributing. Clean diffs, clear intent, and reproducible validation are the fastest path to merge.

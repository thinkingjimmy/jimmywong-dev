# panes/

> L2 | Parent: ../README.md

e2e.mjs: Repeatable index/header/desktop/mobile/hover/rapid-reopen checks using an initialized CUA browser tab; verifies left-aligned open columns, centered home restoration, greeting/theme alignment, whole-row scrolling, preserved reading positions, close behavior, keyboard navigation, adaptive hints, and 3px edge-aligned scrollbars.

Run `verifyDesktopPanes(tab, { capture })`, `verifyMobilePanes(tab, { capture })`, `verifyScrollbarHover(tab, { capture })`, or `verifyRapidReopen(tab)` in the CUA runtime. Pass a bound browser tab. Set the viewport before the mobile run. Use a viewport wider than 1152px for the hover run. The optional capture callback receives a checkpoint name and PNG bytes. Each run returns a JSON report.

Run `verifyWritingIndexPanes(tab, { capture })` at desktop and mobile widths to check the header, index/article stacking, repeat clicks, keyboard focus, browser history, and direct index reload. Save the returned JSON and captured PNGs as verification artifacts.

[PROTOCOL]: Update this header when making changes, then check README.md.

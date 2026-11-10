# home/

> L2 | Parent: ../README.md

e2e.mjs: Focused Chinese/English home checks for language navigation, theme persistence, localized metadata, project links and icons, keyboard access, and narrow layouts.

Failure cases: a locale shows mixed copy; a switch loses the theme or language on reload; browser history returns the wrong language; a project link or icon is missing; header controls overlap or have small hit areas; the mobile page overflows.

Run `verifyHomeLanguage(tab, { capture })` in the CUA runtime with an initialized preview tab. Run once at desktop width and once at 320px. The optional capture callback receives a checkpoint name and PNG bytes. Save the returned JSON report and captures as repeatable verification artifacts.

[PROTOCOL]: Update this header when making changes, then check README.md.

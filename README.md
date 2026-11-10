# Jimmy

个人主页。窄栏介绍、作品和文章。

Next.js 16.4 + React 19.3 + TypeScript + Tailwind CSS 4 + MDX.

<directory>
app/ - Routes, metadata, theme styles, and writing layouts.
components/ - Site UI and persistent horizontal article panes (3 subdirectories: home, ui, writing).
lib/ - Content loading, formatting, embeds, site metadata, and home translations.
content/ - MDX articles.
public/ - Static images and assets.
scripts/ - Focused browser verification for bilingual home content and article columns.
</directory>

<config>
package.json - Dependencies and development commands.
next.config.ts - Next.js configuration.
tsconfig.json - TypeScript settings and import aliases.
</config>

The home column, full writing index, and article panes share one horizontal scroller. The writing index opens articles as panes. Opening a writing pane aligns the row to the viewport's left edge; closing all panes centers the primary column. Panes keep their mounted content and scroll position. Layout changes use transform/opacity motion, with immediate keyboard and reduced-motion paths. The decorative social hint hides while writing panes are open.

The Chinese home is at `/`; the English home is at `/en`. Both routes share the same content component and project data, with localized copy, metadata, and language alternates. The home shows the introduction, My Works, GitHub contributions, and social links.

The header places theme and language controls beside the greeting. The avatar and greeting link to the current home language. Switching languages preserves the theme; the URL preserves the language on reload.

With a fine pointer, each column reveals its 3px scrollbar on hover or keyboard focus. Scrollbars sit at the column edge.

```bash
pnpm dev
```

新文章放到 `content/writing/<slug>.mdx`，frontmatter 需要 `title`、`date`、`summary`。

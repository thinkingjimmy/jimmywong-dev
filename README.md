# Jimmy

个人主页。窄栏介绍、作品和文章。

Next.js 16.4 + React 19.3 + TypeScript + Tailwind CSS 4 + MDX.

<directory>
app/ - Routes, metadata, theme styles, and writing layouts.
components/ - Site UI and persistent horizontal article panes (2 subdirectories: ui, writing).
lib/ - Content loading, formatting, embeds, and site metadata.
content/ - MDX articles.
public/ - Static images and assets.
scripts/ - Focused browser verification for article columns.
</directory>

<config>
package.json - Dependencies and development commands.
next.config.ts - Next.js configuration.
tsconfig.json - TypeScript settings and import aliases.
</config>

The home column, full writing index, and article panes share one horizontal scroller. The home Writing section opens the full index as a pane. Panes keep their mounted content and scroll position. Layout changes use transform/opacity motion, with immediate keyboard and reduced-motion paths. The decorative social hint hides while writing panes are open.

The header places the theme toggle beside the greeting and keeps the avatar and greeting linked to home.

With a fine pointer, each column reveals its 3px scrollbar on hover or keyboard focus. Scrollbars sit at the column edge.

```bash
pnpm dev
```

新文章放到 `content/writing/<slug>.mdx`，frontmatter 需要 `title`、`date`、`summary`。

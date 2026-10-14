# components/

> L2 | Parent: ../README.md

article-body.tsx: Client article content and tweet embed lifecycle.
article-pane.tsx: Labeled writing viewport, close controls, focus, and standalone transitions.
article-stage.tsx: Route-keyed index/article stack, history, layout motion, and horizontal scrolling across every column; exposes useWritingStack and writingLinkClick.
authorship.tsx: Human and AI authorship indicator.
follow-links.tsx: Social links and a text/arrow hint with a shared 220ms entry transition; hides when article columns are open.
github-graph.tsx: Contribution graph and source caption.
mdx.tsx: MDX component mappings.
note.tsx: Author commentary block with the Jimmy label; supports paragraphs, lists, and embeds.
overlay-scrollbar.tsx: Column hover scrollbars with 3px edge-aligned thumbs, keyboard controls, scroll areas, and horizontal wheel handling.
section-divider.tsx: SectionDivider graphic and SectionLabel heading primitive.
site-column.tsx: Centered site content without mount animations.
site-header.tsx: Site identity and a greeting row with the theme toggle at the right edge.
theme-provider.tsx: Theme context.
theme-toggle.tsx: Theme toggle control with a 44px hit area and reduced-motion support.
tweet-card.tsx: Tweet embed markup.
writing-article.tsx: Server-rendered article content and metadata.
writing-index.tsx: Shared full article index with a focusable heading for direct routes and panes.
writing-list.tsx: Article links, open state, and WritingIndexLink for opening the full index as a pane.
writing-shell.tsx: Direct and intercepted article layouts.
zoomable-image.tsx: Article image preview.
ui/: Shared interface primitives.
writing/: Article stack motion helpers.

[PROTOCOL]: Update this header when making changes, then check README.md.

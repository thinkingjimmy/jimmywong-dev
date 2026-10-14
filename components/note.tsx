/**
 * [INPUT]: MDX children containing author commentary, paragraphs, lists, or embeds.
 * [OUTPUT]: Note, a styled author commentary block with the Jimmy label.
 * [POS]: Shared MDX article annotation consumed through mdxComponents.
 * [PROTOCOL]: Update this header when making changes, then check README.md.
 */
import type { ReactNode } from "react";

export function Note({ children }: { children: ReactNode }) {
  return (
    <aside className="mb-4 bg-muted px-3 py-2.5 last:mb-0">
      <div className="mb-1.5 inline-block bg-foreground px-1.5 py-px text-[11px] leading-4 font-medium text-background">
        Jimmy
      </div>
      <div className="text-foreground [&_p]:mb-2 [&_p:last-child]:mb-0 [&_[data-tweet-scale]]:mt-2 [&_[data-tweet-scale]]:mb-0">
        {children}
      </div>
    </aside>
  );
}

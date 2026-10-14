/**
 * [INPUT]: React children containing site content.
 * [OUTPUT]: SiteColumn, the centered content column.
 * [POS]: Shared site layout; ArticleStage owns column motion.
 * [PROTOCOL]: Update this header when making changes, then check README.md.
 */
import type { ReactNode } from "react";

export function SiteColumn({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen justify-center py-10">
      <div
        data-site-column
        className="flex w-full max-w-xl flex-col gap-6 px-4"
      >
        {children}
      </div>
    </div>
  );
}

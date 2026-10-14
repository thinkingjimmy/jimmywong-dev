/**
 * [INPUT]: Route children, SiteColumn, and SiteHeader.
 * [OUTPUT]: SiteLayout for the home route group.
 * [POS]: Site content mounted inside ArticleStage's persistent home column.
 * [PROTOCOL]: Update this header when making changes, then check README.md.
 */
import type { ReactNode } from "react";
import { SiteColumn } from "@/components/site-column";
import { SiteHeader } from "@/components/site-header";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <SiteColumn>
      <SiteHeader />
      {children}
    </SiteColumn>
  );
}

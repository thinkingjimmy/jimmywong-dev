/**
 * [INPUT]: Localized home route children and SiteColumn.
 * [OUTPUT]: SiteLayout for the Chinese and English home routes.
 * [POS]: Home content column inside ArticleStage; HomeContent owns the localized header.
 * [PROTOCOL]: Update this header when making changes, then check README.md.
 */
import type { ReactNode } from "react";
import { SiteColumn } from "@/components/site-column";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return <SiteColumn>{children}</SiteColumn>;
}

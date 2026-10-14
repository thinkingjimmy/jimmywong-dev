/**
 * [INPUT]: Home navigation and shared site identity and column components.
 * [OUTPUT]: NotFound with the site header and a home recovery link.
 * [POS]: Root missing-page fallback inside ArticleStage's primary column.
 * [PROTOCOL]: Update this header when making changes, then check README.md.
 */
import Link from "next/link";
import { SiteColumn } from "@/components/site-column";
import { SiteHeader } from "@/components/site-header";

export default function NotFound() {
  return (
    <SiteColumn>
      <SiteHeader />
      <p className="text-sm leading-6">
        没有找到这个页面。{" "}
        <Link href="/" className="link">
          回到首页
        </Link>
      </p>
    </SiteColumn>
  );
}

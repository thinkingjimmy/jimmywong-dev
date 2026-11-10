/**
 * [INPUT]: Shared localized home content and metadata.
 * [OUTPUT]: HomePage and Chinese canonical/language metadata.
 * [POS]: Chinese home route inside SiteLayout; shares its content structure with /en.
 * [PROTOCOL]: Update this header when making changes, then check README.md.
 */
import { HomeContent, homeMetadata } from "@/components/home/home-content";

export const metadata = homeMetadata("zh");

export default function HomePage() {
  return <HomeContent locale="zh" />;
}

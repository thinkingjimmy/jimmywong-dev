/**
 * [INPUT]: Shared localized home content and metadata.
 * [OUTPUT]: EnglishHomePage and English canonical/language metadata.
 * [POS]: English home route inside SiteLayout; shares its content structure with /.
 * [PROTOCOL]: Update this header when making changes, then check README.md.
 */
import { HomeContent, homeMetadata } from "@/components/home/home-content";

export const metadata = homeMetadata("en");

export default function EnglishHomePage() {
  return <HomeContent locale="en" />;
}

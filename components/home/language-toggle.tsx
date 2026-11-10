/**
 * [INPUT]: The current home locale and localized route/control labels.
 * [OUTPUT]: LanguageToggle with a 44px hit area and document language synchronization.
 * [POS]: Home language navigation beside the theme toggle in SiteHeader.
 * [PROTOCOL]: Update this header when making changes, then check README.md.
 */
"use client";

import { Languages } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { buttonVariants } from "@/components/ui/button";
import { homeCopy, type Locale } from "@/lib/i18n/home";

export function LanguageToggle({ locale }: { locale: Locale }) {
  const copy = homeCopy[locale];
  const target = homeCopy[locale === "zh" ? "en" : "zh"];

  useEffect(() => {
    document.documentElement.lang = copy.languageTag;
  }, [copy.languageTag]);

  return (
    <Link
      href={target.path}
      hrefLang={target.languageTag}
      lang={target.languageTag}
      aria-label={copy.switchLanguage}
      title={copy.switchLanguage}
      className={buttonVariants({
        variant: "ghost",
        size: "icon",
        className: "size-11 touch-manipulation text-foreground transition-opacity hover:bg-transparent hover:opacity-70",
      })}
    >
      <Languages aria-hidden="true" />
    </Link>
  );
}

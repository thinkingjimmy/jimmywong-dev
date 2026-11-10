/**
 * [INPUT]: Home locale, site avatar, localized home links, and theme/language controls.
 * [OUTPUT]: SiteHeader with localized identity and adjacent theme/language controls.
 * [POS]: Shared site identity for the home column and direct writing layouts.
 * [PROTOCOL]: Update this header when making changes, then check README.md.
 */
import Image from "next/image";
import Link from "next/link";
import { LanguageToggle } from "@/components/home/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { homeCopy, type Locale } from "@/lib/i18n/home";

export function SiteHeader({ locale = "zh" }: { locale?: Locale }) {
  const copy = homeCopy[locale];

  return (
    <header lang={copy.languageTag} className="flex flex-col gap-4">
      <Link href={copy.path} className="w-fit rounded-full">
        <Image
          src="/avatar.png"
          alt="Jimmy"
          width={40}
          height={40}
          priority
          unoptimized
          className="size-10 rounded-full object-cover"
        />
      </Link>
      <div className="flex items-center justify-between gap-4">
        <Link href={copy.path} className="min-w-0 w-fit transition-opacity hover:opacity-70">
          <h1 className="text-xl leading-7 font-medium">{copy.greeting}</h1>
        </Link>
        <div className="-my-2 -mr-3 flex shrink-0 items-center">
          <ThemeToggle locale={locale} />
          <LanguageToggle locale={locale} />
        </div>
      </div>
    </header>
  );
}

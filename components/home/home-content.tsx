/**
 * [INPUT]: Localized home copy, project data, and shared header, contribution, and social components.
 * [OUTPUT]: HomeContent and homeMetadata for the Chinese and English home routes.
 * [POS]: Shared server-rendered home content inside SiteLayout's content column.
 * [PROTOCOL]: Update this header when making changes, then check README.md.
 */
import type { Metadata } from "next";
import Image from "next/image";
import { FollowLinks } from "@/components/follow-links";
import { GitHubGraph } from "@/components/github-graph";
import { SectionDivider, SectionLabel } from "@/components/section-divider";
import { SiteHeader } from "@/components/site-header";
import { homeCopy, type Locale } from "@/lib/i18n/home";
import { siteInfo, works } from "@/lib/site";

export function homeMetadata(locale: Locale): Metadata {
  const copy = homeCopy[locale];
  const otherLocale = locale === "zh" ? "en" : "zh";

  return {
    description: copy.description,
    alternates: {
      canonical: copy.path,
      languages: { "zh-CN": "/", en: "/en", "x-default": "/" },
      types: { "text/markdown": "/llms.txt" },
    },
    openGraph: {
      type: "profile",
      locale: copy.openGraphLocale,
      alternateLocale: homeCopy[otherLocale].openGraphLocale,
      url: copy.path,
      siteName: siteInfo.name,
      title: siteInfo.name,
      description: copy.description,
      username: siteInfo.username,
      firstName: siteInfo.name,
      images: [{ url: "/avatar.png", alt: siteInfo.name }],
    },
    twitter: {
      card: "summary",
      site: `@${siteInfo.username}`,
      creator: `@${siteInfo.username}`,
      title: siteInfo.name,
      description: copy.description,
      images: ["/avatar.png"],
    },
  };
}

export function HomeContent({ locale }: { locale: Locale }) {
  const copy = homeCopy[locale];

  return (
    <div lang={copy.languageTag} className="contents">
      <SiteHeader locale={locale} />

      <div className="prose-copy flex flex-col gap-4 text-sm/6">
        <p>{copy.description}</p>
        <p>
          {copy.introductionBeforeLink}
          <a
            className="link"
            href="https://github.com/thinkingjimmy/Learning-Prompt"
            target="_blank"
            rel="noreferrer"
          >
            {copy.tutorialLabel}
          </a>
          {copy.introductionAfterLink}
        </p>
        <p>{copy.agentIntroduction}</p>
      </div>

      <SectionDivider />

      <section>
        <SectionLabel>{copy.worksLabel}</SectionLabel>
        <ul className="flex flex-col gap-3">
          {works.map((work) => (
            <li key={work.href}>
              <a
                href={work.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-2.5 text-sm leading-6 hover:opacity-70"
              >
                <Image
                  src={work.icon}
                  alt=""
                  width={20}
                  height={20}
                  className="mt-0.5 size-5 shrink-0 rounded-[5px]"
                />
                <span>
                  <span className="font-medium">{work.name}</span>
                  <span className="text-muted-foreground"> / {work.description[locale]}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <GitHubGraph />

      <FollowLinks locale={locale} />
    </div>
  );
}

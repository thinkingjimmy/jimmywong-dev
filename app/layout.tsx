import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Schibsted_Grotesk } from "next/font/google";
import Script from "next/script";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { siteJsonLd } from "@/lib/json-ld";
import { siteInfo } from "@/lib/site";
import "./globals.css";

const grotesk = Schibsted_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-schibsted",
  display: "swap",
});

const noto = localFont({
  src: [
    {
      path: "../node_modules/@fontsource/noto-sans-sc/files/noto-sans-sc-chinese-simplified-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../node_modules/@fontsource/noto-sans-sc/files/noto-sans-sc-chinese-simplified-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-noto",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteInfo.url),
  title: {
    default: siteInfo.name,
    template: `%s · ${siteInfo.name}`,
  },
  description: siteInfo.description,
  keywords: [
    "Jimmy",
    "thinkingjimmy",
    "产品经理",
    "产品设计",
    "Prompt Engineering",
    "AI Agent",
  ],
  authors: [{ name: siteInfo.name, url: siteInfo.url }],
  creator: siteInfo.name,
  alternates: {
    types: {
      "text/markdown": "/llms.txt",
    },
  },
  openGraph: {
    type: "profile",
    locale: "zh_CN",
    url: "/",
    siteName: siteInfo.name,
    title: siteInfo.name,
    description: siteInfo.description,
    username: siteInfo.username,
    firstName: siteInfo.name,
    images: [{ url: "/avatar.png", alt: siteInfo.name }],
  },
  twitter: {
    card: "summary",
    site: `@${siteInfo.username}`,
    creator: `@${siteInfo.username}`,
    images: ["/avatar.png"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f4f0" },
    { media: "(prefers-color-scheme: dark)", color: "#1d1d16" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className={`${grotesk.variable} ${noto.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
        />
        <ThemeProvider>
          <div className="flex min-h-screen justify-center py-10">
            <div className="animate-in fade-in flex w-full max-w-xl flex-col gap-6 px-4 duration-700">
              <SiteHeader />
              {children}
            </div>
          </div>
        </ThemeProvider>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${siteInfo.googleAnalyticsId}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${siteInfo.googleAnalyticsId}');`}
        </Script>
      </body>
    </html>
  );
}

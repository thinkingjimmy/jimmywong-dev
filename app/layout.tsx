import type { Metadata } from "next";
import localFont from "next/font/local";
import { Schibsted_Grotesk } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
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
  title: {
    default: "Jimmy",
    template: "%s · Jimmy",
  },
  description: "一名懂点产品设计，又懂点代码的产品经理。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className={`${grotesk.variable} ${noto.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <ThemeProvider>
          <div className="flex min-h-screen justify-center py-10">
            <div className="animate-in fade-in flex w-full max-w-xl flex-col gap-6 px-4 duration-700">
              <SiteHeader />
              {children}
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

/**
 * [INPUT]: Site avatar, home links, and the theme toggle control.
 * [OUTPUT]: SiteHeader with the theme toggle aligned to the greeting's right edge.
 * [POS]: Shared site identity for the home column and direct writing layouts.
 * [PROTOCOL]: Update this header when making changes, then check README.md.
 */
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header className="flex flex-col gap-4">
      <Link href="/" className="w-fit rounded-full">
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
        <Link href="/" className="min-w-0 w-fit transition-opacity hover:opacity-70">
          <h1 className="text-xl leading-7 font-medium">你好，我是 Jimmy 👋</h1>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}

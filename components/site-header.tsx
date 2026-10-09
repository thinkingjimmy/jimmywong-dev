import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { SiteToolbar } from "@/components/site-toolbar";

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
          className="size-10 rounded-full"
        />
      </Link>
      <Link href="/" className="w-fit transition-opacity hover:opacity-70">
        <h1 className="text-xl leading-7 font-medium">你好，我是 Jimmy 👋</h1>
      </Link>
      <Suspense fallback={<div className="h-8" />}>
        <SiteToolbar />
      </Suspense>
    </header>
  );
}

/**
 * [INPUT]: Next.js link navigation to the writing index.
 * [OUTPUT]: WritingNotFound with an article recovery link.
 * [POS]: Missing-article fallback within WritingShell.
 * [PROTOCOL]: Update this header when making changes, then check README.md.
 */
import Link from "next/link";

export default function WritingNotFound() {
  return (
    <p className="text-sm leading-6">
      没有找到这篇文章。{" "}
      <Link href="/writing" className="link">
        回到列表
      </Link>
    </p>
  );
}

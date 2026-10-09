"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  { href: "/", label: "Home" },
  { href: "/writing", label: "Writing" },
] as const;

export function SiteToolbar() {
  const pathname = usePathname();

  return (
    <div className="flex items-center justify-between">
      <nav aria-label="主导航" className="flex items-center gap-4 text-sm leading-6">
        {links.map((link) => {
          const active =
            link.href === "/"
              ? pathname === "/"
              : pathname === link.href || pathname.startsWith(`${link.href}/`);

          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className="hover:opacity-70 data-[current=true]:font-medium"
              data-current={active ? "true" : undefined}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <ThemeToggle />
    </div>
  );
}

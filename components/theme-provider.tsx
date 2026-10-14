/**
 * [INPUT]: React children and next-themes context support.
 * [OUTPUT]: ThemeProvider with persisted theme classes and transition suppression.
 * [POS]: Root theme context consumed by ThemeToggle and writing content.
 * [PROTOCOL]: Update this header when making changes, then check README.md.
 */
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}

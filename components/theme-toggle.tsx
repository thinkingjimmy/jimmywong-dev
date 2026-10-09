"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";

function subscribe(onStoreChange: () => void) {
  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function isDarkClass() {
  return document.documentElement.classList.contains("dark");
}

export function ThemeToggle() {
  const { setTheme } = useTheme();
  const isDark = useSyncExternalStore(subscribe, isDarkClass, () => false);

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={isDark ? "切换到浅色" : "切换到深色"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="size-8 text-foreground hover:bg-transparent hover:opacity-70"
    >
      {isDark ? <Sun /> : <Moon />}
    </Button>
  );
}

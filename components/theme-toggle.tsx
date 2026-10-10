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

function toggleWithCircle(event: React.MouseEvent<HTMLButtonElement>, apply: () => void) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const startViewTransition = document.startViewTransition?.bind(document);

  if (reduceMotion || !startViewTransition) {
    apply();
    return;
  }

  const { top, left, width, height } = event.currentTarget.getBoundingClientRect();
  const x = left + width / 2;
  const y = top + height / 2;
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  );

  const transition = startViewTransition(() => {
    apply();
  });

  transition.ready.then(() => {
    document.documentElement.animate(
      {
        clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`],
      },
      {
        duration: 550,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      },
    );
  });
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
      onClick={(event) => {
        const next = isDark ? "light" : "dark";
        toggleWithCircle(event, () => {
          document.documentElement.classList.toggle("dark", next === "dark");
          setTheme(next);
        });
      }}
      className="size-8 text-foreground hover:bg-transparent hover:opacity-70"
    >
      {isDark ? <Sun /> : <Moon />}
    </Button>
  );
}

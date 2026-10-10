"use client";

import { useEffect, useRef, type ReactNode } from "react";

function messageHeight(data: unknown) {
  if (!data || typeof data !== "object") return null;

  const embed = (data as { "twttr.embed"?: { method?: string; params?: unknown[] } })["twttr.embed"];
  if (embed?.method !== "twttr.private.resize") return null;

  const first = embed.params?.[0];
  if (typeof first === "number" && Number.isFinite(first) && first > 0) return first;
  if (!first || typeof first !== "object" || !("height" in first)) return null;

  const height = (first as { height?: unknown }).height;
  if (typeof height !== "number" || !Number.isFinite(height) || height <= 0) return null;
  return height;
}

function tweetSrc(id: string, theme: "light" | "dark") {
  return `https://platform.twitter.com/embed/Tweet.html?id=${id}&dnt=true&theme=${theme}&lang=zh-cn`;
}

function currentTheme(): "light" | "dark" {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function ArticleBody({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const frames: HTMLIFrameElement[] = [];

    function onMessage(event: MessageEvent) {
      if (event.origin !== "https://platform.twitter.com") return;

      const frame = frames.find((item) => item.contentWindow === event.source);
      if (!frame) return;

      let payload: unknown = event.data;
      if (typeof payload === "string") {
        try {
          payload = JSON.parse(payload) as unknown;
        } catch {
          return;
        }
      }

      const height = messageHeight(payload);
      if (!height) return;
      frame.style.height = `${height}px`;
      const shell = frame.parentElement;
      const scale = Number(shell?.getAttribute("data-tweet-scale"));
      if (shell && Number.isFinite(scale) && scale > 0) {
        shell.style.height = `${Math.round(height * scale)}px`;
      }
    }

    function load(frame: HTMLIFrameElement, id: string, theme: "light" | "dark") {
      const url = new URL(tweetSrc(id, theme));
      url.searchParams.set("v", String(Date.now()));
      frame.dataset.theme = theme;
      frame.src = url.toString();
    }

    function arm(frame: HTMLIFrameElement) {
      if (frames.includes(frame)) return;
      const id = frame.dataset.tweetId;
      if (!id || !/^\d+$/.test(id)) return;
      frames.push(frame);
      load(frame, id, currentTheme());
    }

    function scan() {
      for (const frame of root.querySelectorAll<HTMLIFrameElement>("iframe[data-tweet-id]")) {
        arm(frame);
      }
    }

    function syncTheme() {
      const theme = currentTheme();
      for (const frame of frames) {
        const id = frame.dataset.tweetId;
        if (!id || frame.dataset.theme === theme) continue;
        load(frame, id, theme);
      }
    }

    window.addEventListener("message", onMessage);
    scan();

    const contentObserver = new MutationObserver(scan);
    contentObserver.observe(root, { childList: true, subtree: true });

    const themeObserver = new MutationObserver(syncTheme);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      contentObserver.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("message", onMessage);
    };
  }, []);

  return (
    <div ref={rootRef} className="prose-copy text-sm/6">
      {children}
    </div>
  );
}

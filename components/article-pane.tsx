/**
 * [INPUT]: Writing content, pane labels, overlay scrollbars, router navigation, and shared motion timing.
 * [OUTPUT]: ArticlePane, closeArticle, and useCloseArticle.
 * [POS]: Writing viewport and close controls; ArticleStage manages article and index pane animation.
 * [PROTOCOL]: Update this header when making changes, then check README.md.
 */
"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { OverlayScrollbar, PaneScrollStyle } from "@/components/overlay-scrollbar";
import { Button } from "@/components/ui/button";
import {
  PANE_OPEN_MS as OPEN_MS,
  PANE_CLOSE_MS as CLOSE_MS,
  PANE_EASE as EASE,
  prefersReducedMotion,
} from "@/components/writing/pane-motion";

function desktopPane() {
  return window.matchMedia("(min-width: 48rem)").matches;
}

function moveColumn(open: boolean, instant: boolean) {
  const column = document.querySelector("[data-site-column]");
  if (!(column instanceof HTMLElement)) return;

  if (!desktopPane()) {
    column.style.transition = "none";
    column.style.transform = "";
    document.documentElement.style.removeProperty("--writing-pane-inset");
    return;
  }

  const previous = column.style.transform;
  column.style.transform = "none";
  const layout = column.getBoundingClientRect();
  column.style.transform = previous;

  const fontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  const paneWidth = Math.min(36 * fontSize, window.innerWidth);
  const margin = Math.max(0, (window.innerWidth - paneWidth * 2) / 2);
  const paneLeft = window.innerWidth - margin - paneWidth;
  const shift = Math.max(0, layout.right - paneLeft);
  const target = open && shift > 0 ? `translateX(${-shift}px)` : "";
  document.documentElement.style.setProperty("--writing-pane-inset", open ? `${margin}px` : "0px");

  if (instant || prefersReducedMotion()) {
    column.style.transition = "none";
    column.style.transform = target;
    return;
  }

  const duration = open ? OPEN_MS : CLOSE_MS;
  requestAnimationFrame(() => {
    column.style.transition = `transform ${duration}ms ${EASE}`;
    column.style.transform = target;
  });
}

function pinInlineClose(pane: HTMLElement) {
  const button = pane.querySelector<HTMLButtonElement>("button[aria-label='关闭']");
  if (!button) return;
  const scroller = pane.closest(".overflow-x-auto, .writing-stage-row");
  if (!(scroller instanceof HTMLElement)) {
    button.style.right = "";
    return;
  }
  const paneBox = pane.getBoundingClientRect();
  const view = scroller.getBoundingClientRect();
  const visibleRight = Math.min(paneBox.right, view.right);
  const inset = Math.max(6, paneBox.right - visibleRight + 6);
  const maxInset = Math.max(6, paneBox.width - button.offsetWidth - 6);
  button.style.right = `${Math.min(maxInset, inset)}px`;
}

function resetColumn() {
  const column = document.querySelector("[data-site-column]");
  if (column instanceof HTMLElement) {
    column.style.transition = "none";
    column.style.transform = "";
  }
  document.documentElement.style.removeProperty("--writing-pane-inset");
}

export function closeArticle(router: { back: () => void; replace: (href: string) => void }) {
  if (window.history.length > 1) router.back();
  else router.replace("/writing");
}

export function ArticlePane({
  children,
  motion,
  placement,
  onClose,
  scrollId,
  paneSlug,
  label = "文章",
  closeOnEscape = true,
}: {
  children: ReactNode;
  motion: "enter" | "none" | "managed";
  placement: "overlay" | "inline";
  onClose: (animate?: boolean) => void;
  scrollId?: string;
  paneSlug?: string;
  label?: string;
  closeOnEscape?: boolean;
}) {
  const [open, setOpen] = useState(motion !== "enter");
  const paneRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const closing = useRef(false);
  const closeCleanupRef = useRef<(() => void) | null>(null);

  useLayoutEffect(() => {
    const paneNode = paneRef.current;
    if (!paneNode) return;
    const pane: HTMLElement = paneNode;

    const reduce = prefersReducedMotion();
    const instant = motion !== "enter" || reduce;

    function focusHeading() {
      const heading = pane.querySelector<HTMLElement>("h2");
      if (!heading) return false;
      heading.focus({ preventScroll: true });
      return true;
    }

    if (placement === "overlay") document.documentElement.style.overflowX = "clip";

    if (instant) {
      if (placement === "overlay") moveColumn(true, true);
    }

    const frame = instant
      ? 0
      : requestAnimationFrame(() => {
          setOpen(true);
          if (placement === "overlay") moveColumn(true, false);
        });

    let observer: MutationObserver | undefined;
    if (motion !== "managed" && !focusHeading()) {
      observer = new MutationObserver(() => {
        if (focusHeading()) observer?.disconnect();
      });
      observer.observe(pane, { childList: true, subtree: true });
    }

    function onResize() {
      if (placement === "overlay") moveColumn(true, true);
    }

    window.addEventListener("resize", onResize);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener("resize", onResize);
      document.documentElement.style.overflowX = "";
      if (placement === "overlay") resetColumn();
    };
  }, [motion, placement]);

  useEffect(() => {
    if (!closeOnEscape) return;
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape" || event.defaultPrevented || event.isComposing) return;
      event.preventDefault();
      requestClose(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // The current close handler is bound when the active pane changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closeOnEscape, motion, onClose]);

  useEffect(() => () => closeCleanupRef.current?.(), []);

  useLayoutEffect(() => {
    if (placement !== "inline") return;
    const pane = paneRef.current;
    if (pane) pinInlineClose(pane);
  });

  useEffect(() => {
    if (placement !== "inline") return;
    const paneNode = paneRef.current;
    if (!paneNode) return;
    const pane: HTMLElement = paneNode;

    function pin() {
      pinInlineClose(pane);
    }

    function onScroll(event: Event) {
      if (event.target === pane.closest(".overflow-x-auto, .writing-stage-row")) pin();
    }

    document.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", pin);
    pane.addEventListener("transitionend", pin);
    const settled = window.setTimeout(pin, OPEN_MS + 40);
    return () => {
      document.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", pin);
      pane.removeEventListener("transitionend", pin);
      window.clearTimeout(settled);
    };
  }, [placement]);

  function requestClose(animate = true) {
    if (motion === "managed") {
      onClose(animate);
      return;
    }
    if (closing.current) return;
    closing.current = true;

    if (!animate || prefersReducedMotion()) {
      if (placement === "overlay") resetColumn();
      onClose();
      return;
    }

    setOpen(false);
    if (placement === "overlay") moveColumn(false, false);

    const pane = paneRef.current;
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      closeCleanupRef.current?.();
      onClose();
    };
    const timer = window.setTimeout(finish, CLOSE_MS + 40);
    function onTransitionEnd(event: TransitionEvent) {
      if (event.target === pane && event.propertyName === "transform") finish();
    }
    pane?.addEventListener("transitionend", onTransitionEnd);
    closeCleanupRef.current = () => {
      window.clearTimeout(timer);
      pane?.removeEventListener("transitionend", onTransitionEnd);
      closeCleanupRef.current = null;
    };
  }

  const overlay = placement === "overlay";
  const resolvedScrollId = scrollId ?? (overlay ? "article-overlay-scroll" : "article-inline-scroll");

  return (
    <section
      ref={paneRef}
      data-open={open ? "true" : "false"}
      data-motion={motion}
      data-pane={paneSlug}
      aria-label={label}
      className={
        overlay
          ? "writing-article-pane pane-scroll-region bg-background fixed inset-y-0 z-20 flex w-full flex-col border-border md:w-[36rem] md:border-x"
          : "writing-article-pane pane-scroll-region bg-background border-border relative flex h-full w-[100vw] shrink-0 flex-col border-x md:w-[36rem]"
      }
    >
      <PaneScrollStyle />
      <div
        id={resolvedScrollId}
        ref={scrollRef}
        className="pane-scroll mx-auto min-h-0 w-full max-w-xl flex-1 overflow-x-clip overflow-y-auto overscroll-y-contain"
      >
        <div className="px-4 py-10">{children}</div>
      </div>
      <OverlayScrollbar scrollerRef={scrollRef} controls={resolvedScrollId} />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="关闭"
        onClick={() => requestClose()}
        className="absolute top-0.5 right-1.5 z-20 size-11 bg-background text-foreground transition-opacity hover:bg-background hover:opacity-70"
      >
        <X />
      </Button>
    </section>
  );
}

export function useCloseArticle() {
  const router = useRouter();
  return () => closeArticle(router);
}

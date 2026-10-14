/**
 * [INPUT]: Scroll viewport refs, pointer/keyboard input, and resize/scroll observations.
 * [OUTPUT]: OverlayScrollbar, PaneScrollStyle, ScrollArea, and useHorizontalWheel.
 * [POS]: Shared scroll controls for site and article columns; hover reveals each column's controls.
 * [PROTOCOL]: Update this header when making changes, then check README.md.
 */
"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  type RefObject,
} from "react";

const TRACK_INSET = 12;

const SCROLLBAR_CSS = `
.pane-scroll { scrollbar-width: none; -ms-overflow-style: none; }
.pane-scroll::-webkit-scrollbar { display: none; width: 0; height: 0; }
html:has(.writing-article-pane) { scrollbar-width: none; }
html:has(.writing-article-pane)::-webkit-scrollbar { display: none; width: 0; height: 0; }
.overlay-scrollbar { transition: opacity 120ms cubic-bezier(0.32, 0.72, 0, 1); }
@media (any-hover: hover) and (any-pointer: fine) {
  .overlay-scrollbar { opacity: 0; }
  .overlay-scrollbar-track { pointer-events: none; }
  .pane-scroll-region:hover > .overlay-scrollbar,
  .pane-scroll-region:has(:focus-visible:not([tabindex="-1"])) > .overlay-scrollbar,
  .overlay-scrollbar[data-dragging="true"] { opacity: 1; }
  .pane-scroll-region:hover > .overlay-scrollbar > .overlay-scrollbar-track,
  .pane-scroll-region:has(:focus-visible:not([tabindex="-1"])) > .overlay-scrollbar > .overlay-scrollbar-track,
  .overlay-scrollbar[data-dragging="true"] > .overlay-scrollbar-track { pointer-events: auto; }
}
@media (prefers-reduced-motion: reduce) {
  .overlay-scrollbar { transition: none; }
}
`;

export function PaneScrollStyle() {
  return <style>{SCROLLBAR_CSS}</style>;
}

type Metrics = {
  thumb: number;
  offset: number;
  max: number;
  value: number;
};

function axisMetrics(scroller: HTMLElement, horizontal: boolean) {
  const size = horizontal ? scroller.scrollWidth : scroller.scrollHeight;
  const view = horizontal ? scroller.clientWidth : scroller.clientHeight;
  const value = horizontal ? scroller.scrollLeft : scroller.scrollTop;
  const max = size - view;
  if (max <= 1) return null;
  const track = Math.max(0, view - TRACK_INSET * 2);
  const thumb = Math.max(28, Math.min(track, (view / size) * track));
  const travel = Math.max(1, track - thumb);
  return { thumb, offset: (value / max) * travel, max, value };
}

export function OverlayScrollbar({
  scrollerRef,
  controls,
  orientation = "vertical",
  watch,
}: {
  scrollerRef: RefObject<HTMLElement | null>;
  controls: string;
  orientation?: "vertical" | "horizontal";
  watch?: string;
}) {
  const horizontal = orientation === "horizontal";
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ pointer: number; scroll: number } | null>(null);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const scroller: HTMLElement = el;

    function measure() {
      setMetrics(axisMetrics(scroller, horizontal));
    }

    const frame = requestAnimationFrame(measure);
    scroller.addEventListener("scroll", measure, { passive: true });
    const observer = new ResizeObserver(measure);
    observer.observe(scroller);
    for (const child of scroller.children) observer.observe(child);

    return () => {
      cancelAnimationFrame(frame);
      scroller.removeEventListener("scroll", measure);
      observer.disconnect();
    };
  }, [horizontal, scrollerRef, watch]);

  function scrollByThumb(pointer: number, origin: number, originScroll: number) {
    const el = scrollerRef.current;
    if (!el || !metrics) return;
    const view = horizontal ? el.clientWidth : el.clientHeight;
    const track = Math.max(0, view - TRACK_INSET * 2);
    const travel = Math.max(1, track - metrics.thumb);
    const next = originScroll + ((pointer - origin) / travel) * metrics.max;
    const value = Math.min(metrics.max, Math.max(0, next));
    if (horizontal) el.scrollLeft = value;
    else el.scrollTop = value;
  }

  function onThumbPointerDown(event: PointerEvent<HTMLDivElement>) {
    const el = scrollerRef.current;
    if (!el) return;
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = {
      pointer: horizontal ? event.clientX : event.clientY,
      scroll: horizontal ? el.scrollLeft : el.scrollTop,
    };
    setDragging(true);
  }

  function onThumbPointerMove(event: PointerEvent<HTMLDivElement>) {
    const start = drag.current;
    if (!start) return;
    scrollByThumb(horizontal ? event.clientX : event.clientY, start.pointer, start.scroll);
  }

  function endDrag() {
    drag.current = null;
    setDragging(false);
  }

  function onTrackPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return;
    const el = scrollerRef.current;
    if (!el || !metrics) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = horizontal
      ? (event.clientX - rect.left) / rect.width
      : (event.clientY - rect.top) / rect.height;
    const value = ratio * metrics.max;
    if (horizontal) el.scrollLeft = value;
    else el.scrollTop = value;
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const el = scrollerRef.current;
    if (!el) return;
    const page = horizontal ? el.clientWidth : el.clientHeight;
    const key = event.key;
    if (horizontal) {
      if (key === "ArrowRight") el.scrollLeft += 48;
      else if (key === "ArrowLeft") el.scrollLeft -= 48;
      else if (key === "PageDown") el.scrollLeft += page;
      else if (key === "PageUp") el.scrollLeft -= page;
      else if (key === "Home") el.scrollLeft = 0;
      else if (key === "End") el.scrollLeft = el.scrollWidth;
      else return;
    } else if (key === "ArrowDown") el.scrollTop += 48;
    else if (key === "ArrowUp") el.scrollTop -= 48;
    else if (key === "PageDown") el.scrollTop += page;
    else if (key === "PageUp") el.scrollTop -= page;
    else if (key === "Home") el.scrollTop = 0;
    else if (key === "End") el.scrollTop = el.scrollHeight;
    else return;
    event.preventDefault();
  }

  if (!metrics) return null;

  const thumbClass = dragging ? "bg-foreground/55" : "bg-foreground/25 group-hover:bg-foreground/45";

  return (
    <div
      data-dragging={dragging ? "true" : undefined}
      className={
        horizontal
          ? "overlay-scrollbar pointer-events-none absolute inset-x-3 bottom-px z-10 h-3"
          : "overlay-scrollbar pointer-events-none absolute inset-y-3 right-px z-10 w-3"
      }
    >
      <div className="overlay-scrollbar-track pointer-events-auto absolute inset-0" onPointerDown={onTrackPointerDown}>
        <div
          role="scrollbar"
          aria-orientation={horizontal ? "horizontal" : "vertical"}
          aria-controls={controls}
          aria-valuemin={0}
          aria-valuemax={Math.round(metrics.max)}
          aria-valuenow={Math.round(metrics.value)}
          tabIndex={0}
          onPointerDown={onThumbPointerDown}
          onPointerMove={onThumbPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={onKeyDown}
          className={
            horizontal
              ? "group absolute bottom-0 h-3 touch-none rounded-sm outline-none focus-visible:ring-1 focus-visible:ring-foreground/50"
              : "group absolute right-0 w-3 touch-none rounded-sm outline-none focus-visible:ring-1 focus-visible:ring-foreground/50"
          }
          style={horizontal ? { left: metrics.offset, width: metrics.thumb } : { top: metrics.offset, height: metrics.thumb }}
        >
          <span
            className={
              horizontal
                ? `absolute inset-x-0 bottom-0 h-[3px] rounded-full ${thumbClass}`
                : `absolute inset-y-0 right-0 w-[3px] rounded-full ${thumbClass}`
            }
          />
        </div>
      </div>
    </div>
  );
}

export function useHorizontalWheel(
  scrollerRef: RefObject<HTMLElement | null>,
  active: boolean,
  resetKey = "",
  listenRef?: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    if (!active) return;
    const listen = (listenRef ?? scrollerRef).current;
    if (!listen) return;

    function onWheel(event: WheelEvent) {
      const row = scrollerRef.current;
      if (!row || row.scrollWidth <= row.clientWidth + 1) return;
      const horizontal = event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY);
      if (!horizontal) return;
      if (!event.shiftKey && nestedHorizontalScroll(event.target, row)) return;
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? row.clientWidth : 1;
      const raw =
        event.shiftKey && Math.abs(event.deltaY) > Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
      const delta = raw * unit;
      if (!delta) return;
      const max = row.scrollWidth - row.clientWidth;
      const next = Math.min(max, Math.max(0, row.scrollLeft + delta));
      if (next === row.scrollLeft) return;
      event.preventDefault();
      row.scrollLeft = next;
    }

    listen.addEventListener("wheel", onWheel, { passive: false });
    return () => listen.removeEventListener("wheel", onWheel);
  }, [active, listenRef, resetKey, scrollerRef]);
}

function nestedHorizontalScroll(target: EventTarget | null, boundary: HTMLElement) {
  let node = target instanceof Element ? target : null;
  while (node && node !== boundary) {
    if (node instanceof HTMLElement) {
      const overflowX = getComputedStyle(node).overflowX;
      if ((overflowX === "auto" || overflowX === "scroll") && node.scrollWidth > node.clientWidth + 1) return true;
    }
    node = node.parentElement;
  }
  return false;
}

export function ScrollArea({
  id,
  className,
  viewportClassName,
  children,
}: {
  id: string;
  className?: string;
  viewportClassName?: string;
  children: ReactNode;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  return (
    <div className={`pane-scroll-region relative min-h-0 flex-1 ${className ?? ""}`}>
      <PaneScrollStyle />
      <div
        id={id}
        ref={scrollerRef}
        className={`pane-scroll h-full overflow-x-clip overflow-y-auto overscroll-y-contain ${viewportClassName ?? ""}`}
      >
        {children}
      </div>
      <OverlayScrollbar scrollerRef={scrollerRef} controls={id} />
    </div>
  );
}

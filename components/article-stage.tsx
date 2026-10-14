/**
 * [INPUT]: Pre-rendered writing pages, the underlying route segment, pane viewports, and motion primitives.
 * [OUTPUT]: ArticleStage, useWritingStack, and writingLinkClick for persistent writing navigation.
 * [POS]: Site-level owner of index/article panes, history, scroll continuity, and layout animation.
 * [PROTOCOL]: Update this header when making changes, then check README.md.
 */
"use client";

import { usePathname, useSelectedLayoutSegment } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import { ArticlePane } from "@/components/article-pane";
import { OverlayScrollbar, PaneScrollStyle, ScrollArea, useHorizontalWheel } from "@/components/overlay-scrollbar";
import {
  animatePaneLayout,
  capturePaneLayout,
  PANE_CLOSE_MS,
  PANE_OPEN_MS,
  prefersReducedMotion,
  stageElements,
  type PaneBox,
} from "@/components/writing/pane-motion";

type StackApi = {
  paths: string[];
  open: (path: string, animate?: boolean) => void;
};

type StageState = {
  stack: string[];
  panes: { path: string; exit?: PaneBox }[];
};

type LayoutChange = {
  before: Map<string, PaneBox>;
  animate: boolean;
  duration: number;
  reveal?: string;
  focus: boolean;
};

const WritingStackContext = createContext<StackApi | null>(null);

export function useWritingStack() {
  return useContext(WritingStackContext);
}

function paneId(path: string) {
  return path === "/writing" ? "writing-index" : path.slice("/writing/".length);
}

function revealPane(row: HTMLElement, path: string) {
  const pane = Array.from(row.children).find(
    (child) => child instanceof HTMLElement && child.dataset.stageItem === path,
  );
  if (!(pane instanceof HTMLElement)) return;
  const left = pane.offsetLeft;
  const right = left + pane.offsetWidth;
  const viewLeft = row.scrollLeft;
  const viewRight = viewLeft + row.clientWidth;
  let target = viewLeft;
  if (left < viewLeft) target = left;
  else if (right > viewRight) target = right - row.clientWidth;
  row.scrollLeft = Math.max(0, Math.min(target, row.scrollWidth - row.clientWidth));
}

export function ArticleStage({
  children,
  pane,
  panes,
}: {
  children: ReactNode;
  pane: ReactNode;
  panes: { path: string; content: ReactNode }[];
}) {
  const pathname = usePathname();
  const segment = useSelectedLayoutSegment();
  const baseUrl = segment === "writing" ? "/writing" : "/";
  const [state, setState] = useState<StageState>({ stack: [], panes: [] });
  const stateRef = useRef(state);
  const panesRef = useRef(panes);
  const frameRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const changeRef = useRef<LayoutChange | null>(null);
  const animationsRef = useRef(new Map<string, Animation>());
  const baseUrlRef = useRef(baseUrl);
  const pageScrollRef = useRef(0);
  const wasPresentRef = useRef(false);
  const triggersRef = useRef(new Map<string, HTMLElement>());
  const present = state.panes.length > 0;

  useLayoutEffect(() => {
    stateRef.current = state;
    panesRef.current = panes;
    baseUrlRef.current = baseUrl;
  }, [state, panes, baseUrl]);

  function rememberPageScroll() {
    pageScrollRef.current = document.getElementById("open-page-scroll")?.scrollTop ?? 0;
  }

  function removeExited(path: string) {
    const current = stateRef.current;
    if (current.stack.includes(path)) return;
    const next = { ...current, panes: current.panes.filter((item) => item.path !== path) };
    if (next.panes.length === 0) rememberPageScroll();
    stateRef.current = next;
    setState(next);
  }

  function changeStack(next: string[], animate: boolean, reveal?: string, focus = true) {
    const frame = frameRef.current;
    const before = frame ? capturePaneLayout(frame) : new Map<string, PaneBox>();
    const current = stateRef.current;
    const motion = animate && !prefersReducedMotion();

    // Read the live positions before cancelling so interrupted motion never jumps.
    for (const animation of animationsRef.current.values()) animation.cancel();
    animationsRef.current.clear();

    const closing = motion
      ? current.panes.flatMap(({ path }) => {
          const box = before.get(path);
          return !next.includes(path) && box ? [{ path, exit: box }] : [];
        })
      : [];
    const nextState: StageState = {
      stack: next,
      panes: [...next.map((path) => ({ path })), ...closing],
    };
    if (current.panes.length > 0 && nextState.panes.length === 0) rememberPageScroll();
    changeRef.current = {
      before,
      animate: motion,
      duration: next.length < current.stack.length ? PANE_CLOSE_MS : PANE_OPEN_MS,
      reveal,
      focus,
    };
    stateRef.current = nextState;
    setState(nextState);
  }

  function open(path: string, animate = true) {
    if (!panesRef.current.some((pane) => pane.path === path)) return;
    const current = stateRef.current.stack;
    const activeElement = document.activeElement;
    if (activeElement instanceof HTMLElement && activeElement.closest("a")) {
      triggersRef.current.set(path, activeElement);
    }
    if (current.includes(path)) {
      changeStack(current, animate, path);
      return;
    }
    if (stateRef.current.panes.length === 0) {
      pageScrollRef.current = window.scrollY;
    }
    const next = [...current, path];
    window.history.pushState({ writingPanes: next }, "", path);
    changeStack(next, animate, path);
  }

  function close(path: string, animate = true) {
    const current = stateRef.current.stack;
    if (!current.includes(path)) return;
    const next = current.filter((item) => item !== path);
    const url = next.at(-1) ?? baseUrlRef.current;
    window.history.replaceState({ writingPanes: next }, "", url);
    changeStack(next, animate);
    if (next.length === 0) {
      const trigger = triggersRef.current.get(path);
      const fallback = frameRef.current?.querySelector<HTMLAnchorElement>(`a[href="${path}"]`);
      (trigger?.isConnected ? trigger : fallback)?.focus({ preventScroll: true });
    }
  }

  useEffect(() => {
    const animations = animationsRef.current;
    // A hard navigation renders the route itself, without additional panes.
    window.history.replaceState({ writingPanes: [] }, "", window.location.href);

    function onPop() {
      const stored = window.history.state?.writingPanes;
      if (Array.isArray(stored)) {
        const next = stored.filter((item) => typeof item === "string" && panesRef.current.some((pane) => pane.path === item));
        changeStack(next, false, next.at(-1));
        return;
      }
      const path = window.location.pathname;
      const current = stateRef.current.stack;
      const index = current.indexOf(path);
      const next = path === baseUrlRef.current || !panesRef.current.some((pane) => pane.path === path)
        ? []
        : index === -1 ? [path] : current.slice(0, index + 1);
      changeStack(next, false, next.at(-1));
    }

    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (event.button !== 0) return;
      const anchor = (event.target as Element | null)?.closest("a");
      if (!anchor) return;
      const url = new URL(anchor.href, window.location.origin);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === "/" && stateRef.current.panes.length > 0) {
        changeStack([], false, undefined, false);
      }
    }

    window.addEventListener("popstate", onPop);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("popstate", onPop);
      document.removeEventListener("click", onClick, true);
      for (const animation of animations.values()) animation.cancel();
    };
    // Event listeners read the current stack and geometry through refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    const row = rowRef.current;
    if (!frame || !row) return;
    const pageScroller = document.getElementById("open-page-scroll");
    if (present && !wasPresentRef.current && pageScroller) {
      pageScroller.scrollTop = pageScrollRef.current;
    } else if (!present && wasPresentRef.current) {
      window.scrollTo({ top: pageScrollRef.current, behavior: "instant" });
    }
    wasPresentRef.current = present;

    const change = changeRef.current;
    changeRef.current = null;
    if (!change) return;
    if (change.reveal) revealPane(row, change.reveal);
    if (change.focus) {
      const path = change.reveal ?? state.stack.at(-1);
      const activePane = stageElements(frame).find((element) => element.dataset.stageItem === path);
      activePane?.querySelector<HTMLElement>("h2")?.focus({ preventScroll: true });
    }
    if (!change.animate) return;

    for (const element of stageElements(frame)) {
      const key = element.dataset.stageItem!;
      const exiting = element.dataset.exiting === "true";
      const animation = animatePaneLayout(element, change.before.get(key), change.duration, exiting);
      if (!animation) continue;
      animationsRef.current.set(key, animation);
      animation.onfinish = () => {
        if (animationsRef.current.get(key) !== animation) return;
        animationsRef.current.delete(key);
        if (exiting) removeExited(key);
        else animation.cancel();
      };
    }
    // Each stack transaction supplies one layout snapshot; exit cleanup does not restart motion.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, present]);

  useHorizontalWheel(rowRef, present, "", frameRef);
  const hardArticle = /^\/writing\/[^/]+$/.test(pathname);

  return (
    <WritingStackContext.Provider value={{ paths: state.stack, open }}>
      <PaneScrollStyle />
      <div
        ref={frameRef}
        className="writing-stage"
        data-active={present}
        data-count={Math.min(state.stack.length, 2)}
      >
        <div data-pane-viewport className="writing-stage-viewport pane-scroll-region">
          <div
            ref={rowRef}
            id="writing-pane-row"
            className="writing-stage-row pane-scroll"
          >
            <div data-stage-item="page" className="writing-stage-page">
              <ScrollArea
                id="open-page-scroll"
                className={present ? "h-full" : undefined}
                viewportClassName={present ? "h-full" : "!h-auto !overflow-visible"}
              >
                {children}
              </ScrollArea>
            </div>
            {state.panes.map(({ path, exit }) => (
              <div
                key={path}
                data-stage-item={path}
                data-exiting={exit ? "true" : undefined}
                inert={!!exit}
                aria-hidden={exit ? true : undefined}
                className="writing-stage-pane"
                style={exit ? {
                  position: "fixed",
                  left: exit.left,
                  top: exit.top,
                  width: exit.width,
                  height: exit.height,
                  clipPath: `inset(0 ${exit.clipRight}px 0 ${exit.clipLeft}px)`,
                  pointerEvents: "none",
                  zIndex: 20,
                } : undefined}
              >
                <ArticlePane
                  paneSlug={paneId(path)}
                  scrollId={`article-scroll-${paneId(path)}`}
                  label={path === "/writing" ? "文章列表" : "文章"}
                  motion="managed"
                  placement="inline"
                  closeOnEscape={!exit && path === state.stack.at(-1)}
                  onClose={(animate) => close(path, animate)}
                >
                  {panes.find((pane) => pane.path === path)?.content}
                </ArticlePane>
              </div>
            ))}
          </div>
          <OverlayScrollbar
            orientation="horizontal"
            scrollerRef={rowRef}
            controls="writing-pane-row"
            watch={state.stack.join("|")}
          />
        </div>
        {present || hardArticle ? null : pane}
      </div>
    </WritingStackContext.Provider>
  );
}

export function writingLinkClick(
  event: ReactMouseEvent<HTMLAnchorElement>,
  path: string,
  open: StackApi["open"] | undefined,
) {
  if (!open) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
  event.preventDefault();
  open(path, event.detail !== 0);
}

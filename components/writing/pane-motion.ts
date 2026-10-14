/**
 * [INPUT]: Persistent stage elements and their current DOM geometry.
 * [OUTPUT]: Pane timing, reduced-motion detection, layout snapshots, and transform/opacity animation.
 * [POS]: Motion primitives shared by ArticleStage and ArticlePane.
 * [PROTOCOL]: Update this header when making changes, then check README.md.
 */

export const PANE_OPEN_MS = 240;
export const PANE_CLOSE_MS = 180;
export const PANE_EASE = "cubic-bezier(0.32, 0.72, 0, 1)";
const LAYOUT_EASE = "cubic-bezier(0.4, 0, 0.2, 1)";
const PANE_TRAVEL = 24;

export type PaneBox = {
  left: number;
  top: number;
  width: number;
  height: number;
  opacity: number;
  clipLeft: number;
  clipRight: number;
};

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function stageElements(stage: HTMLElement) {
  return Array.from(stage.querySelectorAll<HTMLElement>("[data-stage-item]"));
}

export function capturePaneLayout(stage: HTMLElement) {
  const boxes = new Map<string, PaneBox>();
  const viewport = stage.querySelector("[data-pane-viewport]")?.getBoundingClientRect();

  for (const element of stageElements(stage)) {
    const box = element.getBoundingClientRect();
    if (box.width === 0) continue;
    const key = element.dataset.stageItem!;
    boxes.set(key, {
      left: box.left,
      top: box.top,
      width: box.width,
      height: box.height,
      opacity: Number(getComputedStyle(element).opacity),
      clipLeft: key !== "page" && viewport ? Math.max(0, viewport.left - box.left) : 0,
      clipRight: key !== "page" && viewport ? Math.max(0, box.right - viewport.right) : 0,
    });
  }

  return boxes;
}

export function animatePaneLayout(
  element: HTMLElement,
  previous: PaneBox | undefined,
  duration: number,
  exiting: boolean,
) {
  const page = element.dataset.stageItem === "page";
  const box = element.getBoundingClientRect();
  if (box.width === 0) return null;
  const offset = previous ? previous.left - box.left : PANE_TRAVEL;
  const opacity = previous?.opacity ?? 0;
  if (page && (!previous || Math.abs(offset) < 0.5)) return null;
  if (!page && !exiting && Math.abs(offset) < 0.5 && opacity === 1) return null;

  const from: Keyframe = { transform: `translateX(${offset}px)` };
  const to: Keyframe = { transform: `translateX(${exiting ? offset + PANE_TRAVEL : 0}px)` };
  if (!page) {
    from.opacity = opacity;
    to.opacity = exiting ? 0 : 1;
  }

  return element.animate([from, to], {
    duration,
    easing: previous && !exiting ? LAYOUT_EASE : PANE_EASE,
    fill: "both",
  });
}

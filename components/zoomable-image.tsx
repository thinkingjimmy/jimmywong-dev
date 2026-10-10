"use client";

import { useEffect, useRef, useState, type ComponentPropsWithoutRef } from "react";
import { createPortal } from "react-dom";

export function ZoomableImage({
  alt = "",
  className,
  src,
  ...props
}: ComponentPropsWithoutRef<"img">) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    closeRef.current?.focus();
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = previousOverflow;
      triggerRef.current?.focus();
    };
  }, [open]);

  const imageClass = ["h-auto max-w-full rounded-md", className].filter(Boolean).join(" ");

  if (!src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img alt={alt} className={imageClass} {...props} />
    );
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="my-1 block w-fit max-w-full cursor-zoom-in border-0 bg-transparent p-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        aria-haspopup="dialog"
        aria-label={alt ? `查看大图：${alt}` : "查看大图"}
        onClick={() => setOpen(true)}
      >
        {/* Markdown images do not include intrinsic dimensions. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt={alt} src={src} className={imageClass} {...props} />
      </button>
      {open
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-label={alt || "大图"}
              className="fixed inset-0 z-50 flex items-center justify-center bg-[#1d1d16]/95 p-4 sm:p-8"
              onClick={() => setOpen(false)}
            >
              <button
                ref={closeRef}
                type="button"
                className="absolute top-4 right-4 text-sm text-[#f4f4f0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                onClick={() => setOpen(false)}
              >
                关闭
              </button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={alt}
                src={src}
                className="max-h-[calc(100dvh-4rem)] max-w-[calc(100vw-2rem)] object-contain sm:max-w-[calc(100vw-4rem)]"
                onClick={(event) => event.stopPropagation()}
              />
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

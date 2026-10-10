import type { ComponentPropsWithoutRef } from "react";
import { TweetCard } from "@/components/tweet-card";
import { ZoomableImage } from "@/components/zoomable-image";

function Anchor({ href = "", ...props }: ComponentPropsWithoutRef<"a">) {
  const external = href.startsWith("http");

  return (
    <a
      href={href}
      className="link"
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      {...props}
    />
  );
}

function Code({ className, ...props }: ComponentPropsWithoutRef<"code">) {
  if (className) {
    return <code className={className} {...props} />;
  }

  return (
    <code className="rounded bg-muted px-1 py-0.5 font-mono text-[0.92em] whitespace-nowrap" {...props} />
  );
}

export const mdxComponents = {
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2 className="mt-8 mb-3 text-base leading-6 font-medium first:mt-0" {...props} />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3 className="mt-6 mb-2 text-sm leading-6 font-medium" {...props} />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => <p className="mb-4 last:mb-0" {...props} />,
  a: Anchor,
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul className="mb-4 list-disc pl-5 last:mb-0" {...props} />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol className="mb-4 list-decimal pl-5 last:mb-0" {...props} />
  ),
  li: (props: ComponentPropsWithoutRef<"li">) => <li className="mb-1 last:mb-0" {...props} />,
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className="mb-4 border-l border-border pl-4 text-muted-foreground last:mb-0"
      {...props}
    />
  ),
  pre: (props: ComponentPropsWithoutRef<"pre">) => (
    <pre
      className="mb-4 overflow-x-auto rounded-md bg-muted p-3 text-left font-mono text-[13px] leading-6 last:mb-0"
      {...props}
    />
  ),
  code: Code,
  strong: (props: ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-medium" {...props} />
  ),
  img: ZoomableImage,
  Tweet: TweetCard,
};

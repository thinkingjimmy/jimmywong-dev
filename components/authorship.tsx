export function Authorship({ human = 80 }: { human?: number }) {
  const share = Math.min(100, Math.max(0, Math.round(human)));
  const ai = 100 - share;

  return (
    <div
      className="flex w-1/2 min-w-0 items-center gap-3 rounded-full border border-border bg-card px-3 py-1 text-left text-xs leading-5"
      aria-label={`本文由人工完成 ${share}%，AI 完成 ${ai}%`}
    >
      <span className="shrink-0 font-medium text-foreground tabular-nums">人工 {share}%</span>
      <span className="relative h-2.5 min-w-0 flex-1" aria-hidden="true">
        <span
          className="absolute inset-y-0 left-0"
          style={{
            width: `${share}%`,
            backgroundImage:
              "repeating-linear-gradient(90deg, var(--foreground) 0 2px, transparent 2px 5px)",
          }}
        />
        <span
          className="absolute inset-y-0 right-0"
          style={{
            width: `${ai}%`,
            backgroundImage:
              "repeating-linear-gradient(90deg, color-mix(in srgb, var(--muted-foreground) 70%, transparent) 0 2px, transparent 2px 5px)",
          }}
        />
      </span>
      <span className="shrink-0 text-muted-foreground tabular-nums">AI {ai}%</span>
    </div>
  );
}

export function SectionDivider() {
  return (
    <div className="flex w-full items-center justify-center gap-2 py-4" aria-hidden="true">
      <span className="size-2 rounded-full bg-[#E9573F]" />
      <span className="size-2 rounded-full bg-[#F0BF2E]" />
      <span className="size-2 rounded-full bg-[#4E964E]" />
    </div>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 font-mono text-sm tracking-wide text-[#abab9c] uppercase dark:text-[#5b5b4b]">
      {children}
    </h2>
  );
}

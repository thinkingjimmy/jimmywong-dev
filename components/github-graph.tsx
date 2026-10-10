import { getContributions } from "@/lib/github";

const LEVELS = [
  "bg-[#e4e4de] dark:bg-[#2f2f26]",
  "bg-[#c8c8be] dark:bg-[#474739]",
  "bg-[#9a9a8c] dark:bg-[#6a6a58]",
  "bg-[#6e6e5e] dark:bg-[#b7b7aa]",
  "bg-[#3f3f34] dark:bg-[#e8e8e3]",
];

export async function GitHubGraph() {
  const data = await getContributions();
  if (!data) return null;

  const totalWeeks = data.weeks.length;

  return (
    <figure className="flex flex-col gap-3">
      <div className="flex text-[10px] leading-none text-[#abab9c] dark:text-[#5b5b4b]">
        {data.months.map((month, index) => (
          <span
            key={`${month.label}-${index}`}
            className="whitespace-nowrap"
            style={{ width: `${(month.weeks / totalWeeks) * 100}%` }}
          >
            {month.label}
          </span>
        ))}
      </div>

      <div
        className="grid gap-[3px]"
        style={{
          gridTemplateRows: "repeat(7, minmax(0, 1fr))",
          gridTemplateColumns: `repeat(${totalWeeks}, minmax(0, 1fr))`,
        }}
        role="img"
        aria-label={`${data.total.toLocaleString("en-US")} contributions on GitHub`}
      >
        {data.weeks.flatMap((week, weekIndex) =>
          Array.from({ length: 7 }, (_, dayIndex) => {
            const day = week[dayIndex];
            return (
              <span
                key={`${weekIndex}-${dayIndex}`}
                title={day?.date}
                className={`aspect-square rounded-full ${LEVELS[day?.level ?? 0]}`}
                style={{ gridColumn: weekIndex + 1, gridRow: dayIndex + 1 }}
              />
            );
          }),
        )}
      </div>

      <figcaption className="flex items-start justify-between gap-4 text-[11px] leading-4 text-[#7c7c67] dark:text-[#abab9c]">
        <p>
          Fig. 1. {data.total.toLocaleString("en-US")} contributions, {data.from} – {data.to}. Source:{" "}
          <a
            href="https://github.com/thinkingjimmy"
            target="_blank"
            rel="noreferrer"
            className="link"
          >
            GitHub
          </a>
          .
        </p>
        <p className="flex shrink-0 items-center gap-1">
          Less
          {LEVELS.map((level) => (
            <span key={level} className={`size-2.5 rounded-full ${level}`} />
          ))}
          More
        </p>
      </figcaption>
    </figure>
  );
}

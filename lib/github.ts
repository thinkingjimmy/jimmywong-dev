const PROFILE = "thinkingjimmy";
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export type ContributionDay = {
  date: string;
  level: number;
};

export type ContributionMonth = {
  label: string;
  weeks: number;
};

export type Contributions = {
  total: number;
  from: string;
  to: string;
  weeks: ContributionDay[][];
  months: ContributionMonth[];
};

function formatLongDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) return value;
  const month = MONTHS[Number(match[2]) - 1];
  if (!month) return value;
  return `${Number(match[3])} ${month} ${match[1]}`;
}

export function parseContributions(html: string): Contributions | null {
  const totalMatch = html.match(/(\d[\d,]*)\s+contributions/);
  const fromMatch = html.match(/data-from="([^"]+)"/);
  const toMatch = html.match(/data-to="([^"]+)"/);
  if (!totalMatch || !fromMatch || !toMatch) return null;

  const weeks: ContributionDay[][] = [];
  const cell =
    /data-date="(\d{4}-\d{2}-\d{2})" id="contribution-day-component-(\d+)-(\d+)" data-level="(\d)"/g;

  for (const match of html.matchAll(cell)) {
    const day = Number(match[2]);
    const week = Number(match[3]);
    weeks[week] ??= [];
    weeks[week][day] = { date: match[1], level: Number(match[4]) };
  }

  if (weeks.length === 0) return null;

  const months: ContributionMonth[] = [];
  const month =
    /ContributionCalendar-label" colspan="(\d+)"[\s\S]*?aria-hidden="true"[^>]*>([A-Za-z]+)</g;
  for (const match of html.matchAll(month)) {
    months.push({ weeks: Number(match[1]), label: match[2] });
  }

  const labeledWeeks = months.reduce((total, item) => total + item.weeks, 0);
  if (weeks.length > labeledWeeks) {
    months.push({ label: "Oct", weeks: weeks.length - labeledWeeks });
  }

  return {
    total: Number(totalMatch[1].replace(/,/g, "")),
    from: formatLongDate(fromMatch[1]),
    to: formatLongDate(toMatch[1]),
    weeks,
    months,
  };
}

export async function getContributions(): Promise<Contributions | null> {
  "use cache";

  try {
    const response = await fetch(`https://github.com/users/${PROFILE}/contributions`, {
      headers: { "User-Agent": "jimmywong-dev" },
    });
    if (!response.ok) return null;
    return parseContributions(await response.text());
  } catch {
    return null;
  }
}

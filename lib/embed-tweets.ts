const tweetUrl =
  /^https?:\/\/(?:www\.|mobile\.)?(?:twitter\.com|x\.com)\/(?:[A-Za-z0-9_]{1,15}\/status|i\/web\/status)\/(\d+)\/?(?:\?[^\s#]*)?(?:#[^\s]*)?$/;

function tweetIdFromText(value: string) {
  return value.match(tweetUrl)?.[1] ?? null;
}

function tweetIdFromLine(line: string) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith(">") || /^(?: {4}|\t)/.test(line)) return null;

  const direct = tweetIdFromText(trimmed);
  if (direct) return direct;

  const wrapped = trimmed.match(/^<([^>\s]+)>$/)?.[1];
  if (wrapped) return tweetIdFromText(wrapped);

  const linked = trimmed.match(/^\[[^\]]*\]\(([^)\s]+)\)$/)?.[1];
  if (linked) return tweetIdFromText(linked);

  return null;
}

export function embedTweetLinks(source: string) {
  let inFence = false;

  return source
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (/^(?:```|~~~)/.test(trimmed)) {
        inFence = !inFence;
        return line;
      }
      if (inFence) return line;

      const id = tweetIdFromLine(line);
      if (!id) return line;
      return `<Tweet id="${id}" />`;
    })
    .join("\n");
}

const tweetIdPattern = /^\d+$/;
const tweetFrameScale = 0.66;
const tweetFrameHeight = 480;
const tweetFrameMax = 550;

export function TweetCard({ id }: { id: string }) {
  if (!tweetIdPattern.test(id)) return null;

  return (
    <div
      data-tweet-scale={tweetFrameScale}
      className="mb-4 overflow-hidden last:mb-0"
      style={{
        width: `min(100%, ${Math.round(tweetFrameMax * tweetFrameScale)}px)`,
        height: tweetFrameHeight * tweetFrameScale,
      }}
    >
      <iframe
        data-tweet-id={id}
        title="X 帖子"
        src={`https://platform.twitter.com/embed/Tweet.html?id=${id}&dnt=true&theme=light&lang=zh-cn`}
        height={tweetFrameHeight}
        className="block max-w-none origin-top-left border-0"
        style={{
          width: `min(${100 / tweetFrameScale}%, ${tweetFrameMax}px)`,
          height: tweetFrameHeight,
          transform: `scale(${tweetFrameScale})`,
        }}
        loading="lazy"
        allow="autoplay; fullscreen"
        allowFullScreen
      />
    </div>
  );
}

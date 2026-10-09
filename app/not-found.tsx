import Link from "next/link";

export default function NotFound() {
  return (
    <p className="text-sm leading-6">
      没有找到这个页面。{" "}
      <Link href="/" className="link">
        回到首页
      </Link>
    </p>
  );
}

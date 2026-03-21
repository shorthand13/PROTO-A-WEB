import { Link } from "@/i18n/routing";

type Props = {
  priority?: boolean;
  className?: string;
};

export default function LogoLink({ priority = false, className = "" }: Props) {
  return (
    <Link
      href="/"
      className={`inline-flex shrink-0 items-center ${className}`}
      aria-label="ProtoA"
    >
      {/* ベクターSVG — 黒い長方形のラスタ問題を避ける */}
      <img
        src="/logo_protoa.svg"
        alt="ProtoA"
        width={140}
        height={32}
        className="h-6 w-auto sm:h-7"
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
      />
    </Link>
  );
}

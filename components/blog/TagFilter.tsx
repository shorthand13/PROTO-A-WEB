"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function TagFilter({ tags }: { tags: string[] }) {
  const t = useTranslations("Blog");
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTag = searchParams.get("tag") || "";

  const handleTag = (tag: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tag) {
      params.set("tag", tag);
    } else {
      params.delete("tag");
    }
    params.delete("page");
    router.push(`/blog?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => handleTag("")}
        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
          !activeTag
            ? "bg-primary text-white"
            : "bg-muted text-muted-foreground hover:bg-muted-foreground/10"
        }`}
      >
        {t("allTags")}
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => handleTag(tag)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            activeTag === tag
              ? "bg-primary text-white"
              : "bg-muted text-muted-foreground hover:bg-muted-foreground/10"
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}

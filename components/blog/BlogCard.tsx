import { Link } from "@/i18n/routing";
import Image from "next/image";
import type { BlogPost } from "@/lib/types";

export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block rounded-2xl border border-border bg-background overflow-hidden shadow-sm hover:shadow-md transition-shadow"

    >
      {post.frontmatter.coverImage && (
        <Image
          src={post.frontmatter.coverImage}
          alt={post.frontmatter.title}
          width={600}
          height={340}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
      <div className="flex flex-wrap gap-2 mb-3">
        {post.frontmatter.tags?.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-primary/30 px-3 py-0.5 text-xs font-medium text-primary"
          >
            {tag}
          </span>
        ))}
      </div>
      <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
        {post.frontmatter.title}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
        {post.frontmatter.excerpt}
      </p>
      <p className="mt-4 text-xs text-muted-foreground">
        {new Date(post.frontmatter.date).toLocaleDateString("ja-JP", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
      </div>
    </Link>
  );
}

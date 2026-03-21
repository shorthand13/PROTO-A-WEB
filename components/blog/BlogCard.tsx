import { Link } from "@/i18n/routing";
import type { BlogPost } from "@/lib/types";

export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block rounded-2xl border border-border bg-background p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex flex-wrap gap-2 mb-3">
        {post.frontmatter.tags?.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-primary-light/20 px-3 py-0.5 text-xs font-medium text-primary"
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
        {post.frontmatter.date}
      </p>
    </Link>
  );
}

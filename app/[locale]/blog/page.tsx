import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { getBlogPosts, getAllTags, getPaginatedPosts } from "@/lib/blog";
import BlogCard from "@/components/blog/BlogCard";
import TagFilter from "@/components/blog/TagFilter";
import { Link } from "@/i18n/routing";

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tag?: string; page?: string }>;
}) {
  const { locale } = await params;
  const { tag, page } = await searchParams;
  setRequestLocale(locale);

  const allPosts = getBlogPosts(locale);
  const tags = getAllTags(locale);
  const filtered = tag
    ? allPosts.filter((p) => p.frontmatter.tags?.includes(tag))
    : allPosts;
  const pageNum = parseInt(page || "1", 10);
  const { posts, totalPages, currentPage } = getPaginatedPosts(
    filtered,
    pageNum
  );

  return <BlogContent posts={posts} tags={tags} totalPages={totalPages} currentPage={currentPage} activeTag={tag} />;
}

function BlogContent({
  posts,
  tags,
  totalPages,
  currentPage,
  activeTag,
}: {
  posts: ReturnType<typeof getBlogPosts>;
  tags: string[];
  totalPages: number;
  currentPage: number;
  activeTag?: string;
}) {
  const t = useTranslations("Blog");

  return (
    <div>
      {/* Page Header */}
      <section className="border-b border-border bg-background px-4 py-16 sm:py-20 text-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold">{t("title")}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{t("subtitle")}</p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Tag Filter */}
          <div className="mb-8">
            <TagFilter tags={tags} />
          </div>

          {/* Posts Grid */}
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-12">
              {t("noPosts")}
            </p>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center gap-4">
              {currentPage > 1 && (
                <Link
                  href={`/blog?page=${currentPage - 1}${activeTag ? `&tag=${activeTag}` : ""}`}
                  className="rounded-full border border-border px-6 py-2 text-sm font-medium hover:bg-muted transition-colors"
                >
                  {t("previousPage")}
                </Link>
              )}
              {currentPage < totalPages && (
                <Link
                  href={`/blog?page=${currentPage + 1}${activeTag ? `&tag=${activeTag}` : ""}`}
                  className="rounded-full border border-border px-6 py-2 text-sm font-medium hover:bg-muted transition-colors"
                >
                  {t("nextPage")}
                </Link>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

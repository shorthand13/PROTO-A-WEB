import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { getBlogPost } from "@/lib/blog";
import { getCMSBlogPost } from "@/lib/microcms";
import { Link } from "@/i18n/routing";
import { Clock, ArrowLeft } from "lucide-react";
import Image from "next/image";
import ShareBar from "@/components/blog/ShareBar";


export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  // Try local first, then CMS
  const post = getBlogPost(locale, slug) ?? (await getCMSBlogPost(slug));
  if (!post) return {};

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  // Try local first, then CMS
  const post = getBlogPost(locale, slug) ?? (await getCMSBlogPost(slug));
  if (!post) notFound();

  return <BlogPostContent post={post} />;
}

function BlogPostContent({
  post,
}: {
  post: NonNullable<ReturnType<typeof getBlogPost>>;
}) {
  const t = useTranslations("Blog");

  return (
    <div className="bg-[#f8f6f3] min-h-screen">
      {/* Back link */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-2">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft size={16} />
          {t("title")}
        </Link>
      </div>

      {/* White Card Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <article className="rounded-2xl bg-background shadow-sm border border-border overflow-hidden">
          <div className="px-6 sm:px-12 lg:px-36 pt-6 sm:pt-8">
            {/* Tags + Date */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex flex-wrap gap-2">
                {post.frontmatter.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs sm:text-sm text-primary font-medium rounded-full border border-primary/30 px-3 py-0.5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                <Clock size={12} className="sm:w-3.5 sm:h-3.5" />
                {new Date(post.frontmatter.date).toLocaleDateString("ja-JP", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-snug text-foreground">
              {post.frontmatter.title}
            </h1>
          </div>

          {/* Cover Image */}
          {post.frontmatter.coverImage && (
            <div className="mt-8 sm:mt-10 px-6 sm:px-12 lg:px-36">
              <Image
                src={post.frontmatter.coverImage}
                alt={post.frontmatter.title}
                width={800}
                height={450}
                className="w-full rounded-lg object-cover"
                priority
              />
            </div>
          )}

          {/* Content */}
          <div className="px-6 sm:px-12 lg:px-36 py-10 sm:py-14">
            <div className="prose max-w-none prose-headings:text-foreground prose-p:text-foreground prose-a:text-primary prose-strong:text-foreground prose-li:text-foreground text-base sm:text-lg lg:text-xl [&_p]:text-base sm:[&_p]:text-lg lg:[&_p]:text-xl [&_li]:text-base sm:[&_li]:text-lg lg:[&_li]:text-xl [&_p]:leading-loose sm:[&_p]:leading-loose [&_p]:mb-6 sm:[&_p]:mb-8">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
          </div>
        </article>
      </div>

      <ShareBar title={post.frontmatter.title} />
    </div>
  );
}

import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getBlogPost, getBlogPosts } from "@/lib/blog";
import { getCMSBlogPost } from "@/lib/microcms";
import { Link } from "@/i18n/routing";
import { ArrowLeft } from "lucide-react";


export const dynamicParams = true;

export async function generateStaticParams() {
  const locales = ["ja", "en"];
  const params: { locale: string; slug: string }[] = [];

  for (const locale of locales) {
    const posts = getBlogPosts(locale);
    posts.forEach((post) => {
      params.push({ locale, slug: post.slug });
    });
  }

  return params;
}

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
    <div>
      {/* Header */}
      <section className="border-b border-border bg-background px-4 py-16 sm:py-20 text-foreground">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
          >
            <ArrowLeft size={16} />
            {t("title")}
          </Link>
          <div className="flex flex-wrap gap-2 mb-4">
            {post.frontmatter.tags?.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-primary/25 bg-primary/10 px-3 py-0.5 text-xs font-medium text-primary"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
            {post.frontmatter.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span>
              {t("author")}: {post.frontmatter.author}
            </span>
            <span>
              {t("publishedAt")}: {post.frontmatter.date}
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <article className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground prose-li:text-muted-foreground">
            {/<[a-z][\s\S]*>/i.test(post.content) ? (
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            ) : (
              <MDXRemote source={post.content} />
            )}
          </article>
        </div>
      </section>
    </div>
  );
}

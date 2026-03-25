import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getCaseStudy, getCaseStudies } from "@/lib/case-studies";
import { getCMSCaseStudy, getCMSCaseStudies } from "@/lib/microcms";
import { Link } from "@/i18n/routing";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import SanitizedHtml from "@/components/SanitizedHtml";

export async function generateStaticParams() {
  const locales = ["ja", "en"];
  const params: { locale: string; slug: string }[] = [];

  for (const locale of locales) {
    const localStudies = getCaseStudies(locale);
    localStudies.forEach((study) => {
      params.push({ locale, slug: study.slug });
    });

    const cmsStudies = await getCMSCaseStudies(locale);
    cmsStudies.forEach((study) => {
      params.push({ locale, slug: study.slug });
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
  const study = getCaseStudy(locale, slug) ?? (await getCMSCaseStudy(slug));
  if (!study) return {};

  return {
    title: study.frontmatter.title,
    description: study.frontmatter.excerpt,
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const study = getCaseStudy(locale, slug) ?? (await getCMSCaseStudy(slug));
  if (!study) notFound();

  return <CaseStudyContent study={study} />;
}

function CaseStudyContent({
  study,
}: {
  study: NonNullable<ReturnType<typeof getCaseStudy>>;
}) {
  const t = useTranslations("CaseStudies");

  return (
    <div>
      {/* Hero with Cover Image */}
      {study.frontmatter.coverImage ? (
        <section className="relative">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-6">
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
            >
              <ArrowLeft size={16} />
              {t("title")}
            </Link>
          </div>
          <div>
            <div className="mb-8 px-4 sm:px-6 lg:px-8 mx-auto max-w-5xl">
              <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                {study.frontmatter.title}
              </h1>
            </div>
            <div className="relative overflow-hidden">
              <Image
                src={study.frontmatter.coverImage}
                alt={study.frontmatter.title}
                width={1024}
                height={576}
                className="w-full max-h-[480px] object-cover block"
              />
              {/* Mobile: tag on image */}
              <div className="absolute bottom-3 right-3 sm:hidden">
                <span className="inline-block rounded-full border border-white/30 bg-white/15 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white">
                  {study.frontmatter.industry}
                </span>
              </div>
            </div>
            {/* Desktop: tag under image */}
            <div className="hidden sm:flex justify-end mx-auto max-w-5xl px-6 lg:px-8 mt-4">
              <span className="inline-block rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {study.frontmatter.industry}
              </span>
            </div>
          </div>
        </section>
      ) : (
        <section className="border-b border-border bg-background px-4 py-16 sm:py-20 text-foreground">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
            >
              <ArrowLeft size={16} />
              {t("title")}
            </Link>
            <span className="inline-block rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
              {study.frontmatter.industry}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              {study.frontmatter.title}
            </h1>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="py-12 px-4">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <article className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground prose-li:text-muted-foreground prose-blockquote:text-muted-foreground prose-blockquote:border-primary">
            {/<[a-z][\s\S]*>/i.test(study.content) ? (
              <SanitizedHtml html={study.content} />
            ) : (
              <MDXRemote source={study.content} />
            )}
          </article>
        </div>
      </section>
    </div>
  );
}

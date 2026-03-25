import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { getCaseStudies } from "@/lib/case-studies";
import { getCMSCaseStudies } from "@/lib/microcms";
import { Link } from "@/i18n/routing";

export default async function CaseStudiesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tag?: string }>;
}) {
  const { locale } = await params;
  const { tag } = await searchParams;
  setRequestLocale(locale);

  const localStudies = getCaseStudies(locale);
  const cmsStudies = await getCMSCaseStudies(locale);
  const allStudies = [...cmsStudies, ...localStudies];

  const allTags = Array.from(
    new Set(allStudies.flatMap((s) => s.frontmatter.tags ?? []))
  );

  const studies = tag
    ? allStudies.filter((s) => s.frontmatter.tags?.includes(tag))
    : allStudies;

  return (
    <CaseStudiesContent studies={studies} allTags={allTags} activeTag={tag} />
  );
}

function CaseStudiesContent({
  studies,
  allTags,
  activeTag,
}: {
  studies: ReturnType<typeof getCaseStudies>;
  allTags: string[];
  activeTag?: string;
}) {
  const t = useTranslations("CaseStudies");

  return (
    <div>
      {/* Page Header */}
      <section className="bg-background px-4 py-8 sm:py-20 text-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-4xl font-bold">{t("title")}</h1>
          <p className="mt-1 sm:mt-4 text-sm sm:text-lg text-muted-foreground">{t("subtitle")}</p>
        </div>
      </section>

      <section className="py-6 sm:py-12 px-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Tag filters */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5 sm:mb-8">
              <Link
                href="/case-studies"
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  !activeTag
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted-foreground/10"
                }`}
              >
                {t("allTags")}
              </Link>
              {allTags.map((tag) => (
                <Link
                  key={tag}
                  href={`/case-studies?tag=${encodeURIComponent(tag)}` as "/case-studies"}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    activeTag === tag
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted-foreground/10"
                  }`}
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}

          {studies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
              {studies.map((study) => (
                <Link
                  key={study.slug}
                  href={`/case-studies/${study.slug}`}
                  className="group block rounded-xl sm:rounded-2xl border border-border bg-background p-4 sm:p-8 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2.5 sm:mb-4">
                    <span className="inline-block rounded-full bg-cta/10 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-medium text-cta">
                      {study.frontmatter.industry}
                    </span>
                    {study.frontmatter.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-medium text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-base sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {study.frontmatter.title}
                  </h3>
                  <p className="mt-2 sm:mt-3 text-xs sm:text-base text-muted-foreground line-clamp-3">
                    {study.frontmatter.excerpt}
                  </p>
                  <span className="mt-3 sm:mt-4 inline-flex items-center text-xs sm:text-sm font-medium text-primary">
                    {t("readMore")} →
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-12">
              {t("noCases")}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { getCaseStudies } from "@/lib/case-studies";
import { Link } from "@/i18n/routing";

export default async function CaseStudiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const studies = getCaseStudies(locale);

  return <CaseStudiesContent studies={studies} />;
}

function CaseStudiesContent({
  studies,
}: {
  studies: ReturnType<typeof getCaseStudies>;
}) {
  const t = useTranslations("CaseStudies");

  return (
    <div>
      {/* Page Header */}
      <section className="bg-gradient-to-br from-primary to-primary-dark px-4 py-16 sm:py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold">{t("title")}</h1>
          <p className="mt-4 text-lg text-white/90">{t("subtitle")}</p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {studies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {studies.map((study) => (
                <Link
                  key={study.slug}
                  href={`/case-studies/${study.slug}`}
                  className="group block rounded-2xl border border-border bg-background p-8 shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="inline-block rounded-full bg-cta/10 px-3 py-1 text-xs font-medium text-cta mb-4">
                    {study.frontmatter.industry}
                  </span>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {study.frontmatter.title}
                  </h3>
                  <p className="mt-3 text-muted-foreground">
                    {study.frontmatter.excerpt}
                  </p>
                  <span className="mt-4 inline-flex items-center text-sm font-medium text-primary">
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

import { useTranslations } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getCaseStudies } from "@/lib/case-studies";
import { getCMSCaseStudies } from "@/lib/microcms";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { generatePageMetadata } from "@/lib/metadata";

export const revalidate = 0;

function pseudoRandomTime(slug: string) {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  }
  const hour = 9 + (hash % 9); // 9:00–17:xx
  const minute = [0, 15, 30, 45][(hash >> 3) % 4];
  return `${hour}:${minute.toString().padStart(2, "0")}`;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "CaseStudies" });
  return generatePageMetadata({
    locale,
    title: t("title"),
    description: t("subtitle"),
    path: "/case-studies",
  });
}

export default async function CaseStudiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const localStudies = getCaseStudies(locale);
  const cmsStudies = await getCMSCaseStudies(locale);
  const studies = [...cmsStudies, ...localStudies];

  return <CaseStudiesContent studies={studies} />;
}

function CaseStudiesContent({
  studies,
}: {
  studies: ReturnType<typeof getCaseStudies>;
}) {
  const t = useTranslations("CaseStudies");

  return (
    <div className="bg-[#f8f6f3] min-h-screen">
      {/* Page Header */}
      <section className="px-4 pt-8 pb-4 sm:pt-20 sm:pb-6 text-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-4xl font-bold">{t("title")}</h1>
          <p className="mt-1 sm:mt-4 text-sm sm:text-lg text-muted-foreground">{t("subtitle")}</p>
        </div>
      </section>

      <section className="py-4 sm:py-8 px-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {studies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {studies.map((study) => (
                <Link
                  key={study.slug}
                  href={`/case-studies/${study.slug}`}
                  className="group block rounded-2xl border border-border bg-background overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {study.frontmatter.coverImage && (
                    <Image
                      src={study.frontmatter.coverImage}
                      alt={study.frontmatter.title}
                      width={600}
                      height={340}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {study.frontmatter.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-primary/30 px-3 py-0.5 text-xs font-medium text-primary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {study.frontmatter.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {study.frontmatter.excerpt}
                    </p>
                    <p className="mt-4 text-xs text-muted-foreground">
                      {new Date(study.frontmatter.date).toLocaleDateString("ja-JP", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}{" "}
                      {pseudoRandomTime(study.slug)}
                    </p>
                  </div>
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

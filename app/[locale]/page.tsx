import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { GraduationCap, Handshake } from "lucide-react";
import HomeFlipGrid from "@/components/HomeFlipGrid";
import HeroSection from "@/components/HeroSection";
import { getCaseStudies } from "@/lib/case-studies";
import { getCMSCaseStudies } from "@/lib/microcms";
import type { CaseStudy } from "@/lib/types";

export const revalidate = 0;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const localStudies = getCaseStudies(locale);
  let cmsStudies: CaseStudy[] = [];
  try {
    cmsStudies = await getCMSCaseStudies(locale);
  } catch {
    // CMS unavailable — use local only
  }
  const caseStudies = [...cmsStudies, ...localStudies].slice(0, 4);

  return <HomeContent caseStudies={caseStudies} />;
}

function extractSection(content: string, heading: string): string {
  const regex = new RegExp(`## ${heading}\\n+([\\s\\S]*?)(?=\\n## |$)`);
  const match = content.match(regex);
  if (!match) return "";
  return match[1]
    .replace(/\*\*/g, "")
    .replace(/^- /gm, "")
    .replace(/^\d+\.\s/gm, "")
    .replace(/> .*/g, "")
    .trim()
    .slice(0, 120) + "…";
}

function HomeContent({ caseStudies }: { caseStudies: CaseStudy[] }) {
  const t = useTranslations("Home");
  const ts = useTranslations("Services");
  const tc = useTranslations("CaseStudies");


  return (
    <div className="flex flex-col flex-1 bg-white">
      {/* ===================== MOBILE ===================== */}
      <div className="sm:hidden px-4 py-6 flex flex-col gap-3">
        {/* Solution */}
        <div className="rounded-2xl bg-primary text-white p-8">
          <h2 className="text-[1.55rem] font-bold leading-tight whitespace-pre-line">
            {t("solution.title")}
          </h2>
          <p className="mt-6 text-sm text-white/80 leading-relaxed whitespace-pre-line">
            {t("solution.subtitle")}
          </p>
        </div>

        {/* Services + Case Studies accordion */}
        <HomeFlipGrid
          sectionLabel=""
          viewAllLabel=""
          viewAllHref="/case-studies"
          servicesLabel={ts("title")}
          caseStudiesLabel={tc("title")}
          services={([
            { key: "training", icon: "training" as const, image: "/photos/service-1.svg" },
            { key: "accompaniment", icon: "accompaniment" as const, image: "/photos/service-2.svg" },
          ]).map((s) => ({
            ...s,
            title: ts(`${s.key}.title`),
            description: ts(`${s.key}.description`),
            features: ts.raw(`${s.key}.features`) as string[],
            label: ts("title"),
            ctaLabel: ts("cta"),
            ctaHref: "/services",
          }))}
          caseStudies={caseStudies.slice(0, 2).map((study) => ({
            slug: study.slug,
            title: study.frontmatter.title,
            excerpt: study.frontmatter.excerpt,
            industry: study.frontmatter.industry,
            tags: study.frontmatter.tags ?? [],
            challengeLabel: tc("challenge"),
            solutionLabel: tc("solution"),
            challenge: extractSection(study.content, "課題") || extractSection(study.content, "Challenge"),
            solution: extractSection(study.content, "解決策") || extractSection(study.content, "Solution"),
            ctaLabel: tc("readMore"),
            ctaHref: `/case-studies/${study.slug}`,
          }))}
        />

        {/* CTA */}
        <div className="rounded-2xl bg-transparent text-foreground p-6 text-center">
          <h2 className="text-xl font-bold">{t("cta.title")}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{t("cta.subtitle")}</p>
          <Link
            href="/contact"
            className="mt-5 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-primary-dark transition-colors"
          >
            {t("cta.button")}
          </Link>
        </div>
      </div>

      {/* ===================== DESKTOP (sm+) ===================== */}
      <div className="hidden sm:flex flex-col">
        {/* Row 1: Hero+Solution (4/6) | Testimonials + Blog (2/6) */}
        <section className="px-4 pt-8">
          <div className="mx-auto max-w-7xl grid grid-cols-7 gap-6">
            {/* ProtoA Mark */}
            <div className="col-span-5 px-1 -mb-4">
              <Image src="/logo_protoa.svg" alt="ProtoA" width={180} height={42} className="h-10 w-auto" />
            </div>

            {/* Hero + Solution + Side tiles (single animation controller) */}
            <HeroSection
              heroLine1={t("problem.title")}
              heroLine2={t("problem.subtitle")}
              solutionTitle={t("solution.title")}
              solutionSubtitle={t("solution.subtitle")}
              casestudySlot={
                <div className="rounded-3xl bg-[#6b9e9e] text-white p-5 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <span className="rounded-full bg-white/30 backdrop-blur-sm px-3 py-1.5 text-xs font-bold flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-white" />
                      {tc("title")}
                    </span>
                    <Link href="/case-studies" className="h-8 w-8 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors">
                      <span className="text-sm">↗</span>
                    </Link>
                  </div>
                  {caseStudies[0] && (
                    <Link
                      href={`/case-studies/${caseStudies[0].slug}` as "/case-studies"}
                      className="group flex-1 flex flex-col justify-end rounded-xl overflow-hidden relative transition-all"
                    >
                      {caseStudies[0].frontmatter.coverImage ? (
                        <img
                          src={caseStudies[0].frontmatter.coverImage}
                          alt=""
                          className="absolute inset-0 w-full h-full object-cover opacity-50 transition-opacity duration-300 group-hover:opacity-100"
                        />
                      ) : null}
                      <div className="absolute inset-0 bg-black/15" />
                      <div className="relative z-10 p-5">
                        <p className="text-base font-bold text-white leading-snug">
                          {caseStudies[0].frontmatter.title}
                        </p>
                        <p className="mt-2 text-sm text-white/90 leading-relaxed line-clamp-4">
                          {extractSection(caseStudies[0].content, "課題") || extractSection(caseStudies[0].content, "Challenge")}
                        </p>
                      </div>
                    </Link>
                  )}
                </div>
              }
              blogSlot={
                <a
                  href="https://note.com/ayakasunakawa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-3xl bg-[#f0e6d3] p-5 flex items-center justify-center group hover:shadow-md transition-shadow min-h-[160px]"
                >
                  <span className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-foreground shadow-sm flex items-center gap-3">
                    {t("blog.moreLabel")}
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </a>
              }
            />
          </div>
        </section>


        {/* Row 4: Services */}
        <section className="px-4 pt-6">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-bold text-foreground tracking-widest mb-4">
              {ts("title")}
            </p>
            <div className="grid grid-cols-2 gap-6">
              {([
                { key: "training", icon: GraduationCap, image: "/photos/service-training.svg" },
                { key: "accompaniment", icon: Handshake, image: "/photos/service-accompaniment.svg" },
              ] as const).map(({ key, icon: Icon, image }) => (
                <Link
                  key={key}
                  href="/services"
                  className="rounded-3xl overflow-hidden bg-white group hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="relative aspect-[3/1]">
                    <Image
                      src={image}
                      alt={ts(`${key}.title`)}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="text-base font-bold text-white">{ts(`${key}.title`)}</h3>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {ts(`${key}.description`)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>


        {/* Row 3: Partners + CTA stacked */}
        <section className="px-4 py-6">
          <div className="mx-auto max-w-7xl flex flex-col gap-6">
            <div className="rounded-3xl bg-white py-10 px-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground text-center mb-8">
                {t("partners.title")}
              </h2>
              <div className="flex items-center justify-center gap-6">
                {["Partner A", "Partner B", "Partner C", "Partner D", "Partner E"].map((name) => (
                  <div key={name} className="h-14 w-32 rounded-lg bg-muted border border-border flex items-center justify-center text-xs text-muted-foreground font-medium">
                    {name}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-transparent text-foreground p-10 flex flex-col justify-center text-center min-h-[200px]">
              <h2 className="text-2xl font-bold">{t("cta.title")}</h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">{t("cta.subtitle")}</p>
              <Link
                href="/contact"
                className="mt-5 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-primary-dark transition-colors mx-auto"
              >
                {t("cta.button")}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

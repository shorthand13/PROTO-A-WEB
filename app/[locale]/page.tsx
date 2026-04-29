import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { GraduationCap, Handshake, CalendarDays, ChevronRight, MapPin, ArrowRight, FileText } from "lucide-react";
// import HomeFlipGrid from "@/components/HomeFlipGrid";
import HeroSection from "@/components/HeroSection";
import { getCaseStudies } from "@/lib/case-studies";
import { getCMSCaseStudies, getCMSEvents, type CMSEvent } from "@/lib/microcms";
import type { CaseStudy } from "@/lib/types";
import DoubleDiamond from "@/components/DoubleDiamond";
import DoubleDiamondDesktop from "@/components/DoubleDiamondDesktop";
import HeroCarousel from "@/components/HeroCarousel";

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

  let upcomingEvents: CMSEvent[] = [];
  try {
    const { upcoming } = await getCMSEvents();
    upcomingEvents = upcoming;
  } catch {
    // CMS unavailable
  }

  return <HomeContent caseStudies={caseStudies} upcomingEvents={upcomingEvents} locale={locale} />;
}

function extractSection(content: string, heading: string): string {
  // Try markdown format: ## Heading
  const mdRegex = new RegExp(`## ${heading}\\n+([\\s\\S]*?)(?=\\n## |$)`);
  const mdMatch = content.match(mdRegex);
  if (mdMatch) {
    return mdMatch[1]
      .replace(/\*\*/g, "")
      .replace(/^- /gm, "")
      .replace(/^\d+\.\s/gm, "")
      .replace(/> .*/g, "")
      .trim()
      .slice(0, 60) + "…";
  }

  // Try HTML format: <h2...>Heading</h2>content
  const htmlRegex = new RegExp(`<h2[^>]*>${heading}</h2>([\\s\\S]*?)(?=<h2|$)`);
  const htmlMatch = content.match(htmlRegex);
  if (htmlMatch) {
    return htmlMatch[1]
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .trim()
      .slice(0, 60) + "…";
  }

  return "";
}

function HomeContent({ caseStudies, upcomingEvents, locale }: { caseStudies: CaseStudy[]; upcomingEvents: CMSEvent[]; locale: string }) {
  const t = useTranslations("Home");
  const ts = useTranslations("Services");
  const tc = useTranslations("CaseStudies");


  return (
    <div className="flex flex-col flex-1 bg-white">
      <h1 className="sr-only">ProtoA — DXコンサルティング</h1>
      {/* ===================== MOBILE ===================== */}
      <div className="sm:hidden px-4 py-6 flex flex-col gap-3">
        {/* Story carousel: Problem → Solution → Logo */}
        <HeroCarousel
          problemLabel={t("problem.label")}
          problemTitle={t("problem.title")}
          problemSubtitle={t("problem.subtitle")}
          solutionTitle={t("solution.title")}
          solutionSubtitle={t("solution.subtitle")}
        />

        {/* Miyakojima origin tagline */}
        <p className="text-xs text-muted-foreground text-center tracking-wide">
          — 宮古島発のDX支援会社 —
        </p>

        {/* Double Diamond storytelling */}
        <DoubleDiamond
          services={[
            {
              title: ts("training.title"),
              description: ts("training.description"),
              features: ts.raw("training.features") as string[],
              ctaLabel: ts("cta"),
              ctaHref: "/services",
            },
            {
              title: ts("accompaniment.title"),
              description: ts("accompaniment.description"),
              features: ts.raw("accompaniment.features") as string[],
              ctaLabel: ts("cta"),
              ctaHref: "/services",
            },
          ]}
        />

        {/* Upcoming event tile */}
        {upcomingEvents.length > 0 && (() => {
          const nextEvent = upcomingEvents[0];
          return (
            <Link
              href={`/events/${nextEvent.id}` as "/events"}
              className="rounded-2xl bg-white border border-border shadow-sm p-5 flex flex-col gap-3 group hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold text-primary flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  開催予定イベント
                </span>
                <ChevronRight size={16} className="text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
              </div>

              <h3 className="text-base font-bold text-foreground leading-snug">
                {nextEvent.title}
              </h3>

              {nextEvent.tags && nextEvent.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {nextEvent.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-medium text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
                <span className="flex items-start gap-1.5">
                  <CalendarDays size={14} className="text-primary flex-shrink-0 mt-[3px]" />
                  {new Date(nextEvent.date).toLocaleDateString(locale === "ja" ? "ja-JP" : "en-US", {
                    month: "long",
                    day: "numeric",
                    weekday: "short",
                  })}
                </span>
                {nextEvent.location && (
                  <span className="flex items-start gap-1.5">
                    <MapPin size={14} className="text-primary flex-shrink-0 mt-[3px]" />
                    {nextEvent.location}
                  </span>
                )}
              </div>
            </Link>
          );
        })()}

        {/* Case Studies link */}
        <Link
          href="/case-studies"
          className="rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/15 p-5 flex items-center gap-4 group"
        >
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-foreground">{tc("title")}</p>
            {caseStudies[0] && (
              <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{caseStudies[0].frontmatter.title}</p>
            )}
          </div>
          <ChevronRight size={18} className="text-primary/40 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
        </Link>

        {/* Blog link */}
        <Link
          href="/blog"
          className="rounded-2xl bg-[#f0e6d3] border border-[#e6d5bd] p-5 flex items-center gap-4 group"
        >
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-foreground">{t("blog.moreLabel")}</p>
          </div>
          <ChevronRight size={18} className="text-primary/40 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
        </Link>

        {/* Partners (mobile) */}
        <div className="rounded-2xl bg-white py-8 px-6">
          <h2 className="text-2xl font-bold text-foreground text-center mb-6 whitespace-pre-line">
            {t("partners.title")}
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {[
              { src: "/logos/sigma.png", alt: "Sigma" },
              { src: "/logos/miyanohana.png", alt: "Miyanohana" },
              { src: "/logos/takabashira.jpg", alt: "Takabashira" },
            ].map((logo) => (
              <Image
                key={logo.alt}
                src={logo.src}
                alt={logo.alt}
                width={120}
                height={45}
                className="h-12 w-auto object-contain"
              />
            ))}
          </div>
        </div>

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
                <Link
                  href="/blog"
                  className="rounded-3xl bg-[#f0e6d3] p-5 flex items-center justify-center group hover:shadow-md transition-shadow min-h-[160px]"
                >
                  <span className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-foreground shadow-sm flex items-center gap-3">
                    {t("blog.moreLabel")}
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </Link>
              }
            />
          </div>
        </section>


        {/* Double Diamond */}
        <section className="px-4 pt-12">
          <div className="mx-auto max-w-7xl">
            <DoubleDiamondDesktop />
          </div>
        </section>

        {/* Events & Case Studies entry */}
        <section className="px-4 pt-12">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-3xl overflow-hidden border border-border">
              <div className="grid grid-cols-2 divide-x divide-border">
                <Link
                  href="/events"
                  className="p-10 bg-gradient-to-br from-[#eaad63]/10 to-[#eaad63]/5 flex items-center gap-6 group hover:from-[#eaad63]/20 transition-all"
                >
                  <div className="h-14 w-14 rounded-full bg-[#eaad63]/20 flex items-center justify-center flex-shrink-0">
                    <CalendarDays size={26} className="text-[#eaad63]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground">イベント</h3>
                    {upcomingEvents[0] ? (
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-1">{upcomingEvents[0].title}</p>
                    ) : (
                      <p className="mt-1 text-sm text-muted-foreground">一覧を見る</p>
                    )}
                  </div>
                  <ArrowRight size={20} className="text-muted-foreground group-hover:translate-x-1 transition-transform flex-shrink-0" />
                </Link>

                <Link
                  href="/case-studies"
                  className="p-10 bg-gradient-to-br from-primary/5 to-primary/10 flex items-center gap-6 group hover:from-primary/15 transition-all"
                >
                  <div className="h-14 w-14 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                    <FileText size={26} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground">{tc("title")}</h3>
                    {caseStudies[0] ? (
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-1">{caseStudies[0].frontmatter.title}</p>
                    ) : (
                      <p className="mt-1 text-sm text-muted-foreground">事例を見る</p>
                    )}
                  </div>
                  <ArrowRight size={20} className="text-muted-foreground group-hover:translate-x-1 transition-transform flex-shrink-0" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Partners */}
        <section className="px-4 pt-12 pb-6">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-3xl bg-white py-10 px-8">
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground text-center mb-10">
                {t("partners.title")}
              </h2>
              <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
                {[
                  { src: "/logos/sigma.png", alt: "Sigma" },
                  { src: "/logos/miyanohana.png", alt: "Miyanohana" },
                  { src: "/logos/takabashira.jpg", alt: "Takabashira" },
                ].map((logo) => (
                  <Image
                    key={logo.alt}
                    src={logo.src}
                    alt={logo.alt}
                    width={160}
                    height={60}
                    className="h-16 sm:h-20 w-auto object-contain"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Row 4: Services */}
        <section className="px-4 pt-12">
          <div className="mx-auto max-w-7xl">
            <p className="text-4xl lg:text-5xl font-bold text-foreground tracking-widest mb-10 text-center">
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

        {/* CTA */}
        <section className="px-4 py-6">
          <div className="mx-auto max-w-7xl flex flex-col gap-6">
            <div className="rounded-3xl bg-transparent text-foreground p-10 flex flex-col justify-center text-center min-h-[200px]">
              <h2 className="text-3xl lg:text-4xl font-bold">{t("cta.title")}</h2>
              <p className="mt-3 text-base text-muted-foreground max-w-md mx-auto">{t("cta.subtitle")}</p>
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

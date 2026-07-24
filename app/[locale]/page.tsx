import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Yomogi } from "next/font/google";
import { GraduationCap, Handshake, CalendarDays, ChevronRight, MapPin, ArrowRight, FileText, PawPrint } from "lucide-react";
// import HomeFlipGrid from "@/components/HomeFlipGrid";
import HeroSection from "@/components/HeroSection";
import { getCaseStudies } from "@/lib/case-studies";
import { getCMSCaseStudies, getCMSEvents, type CMSEvent } from "@/lib/microcms";
import type { CaseStudy } from "@/lib/types";
import DoubleDiamond from "@/components/DoubleDiamond";
import DoubleDiamondDesktop from "@/components/DoubleDiamondDesktop";

export const revalidate = 0;

const yomogi = Yomogi({ weight: "400", subsets: ["latin"], display: "swap" });

const SUNNY_URL = "https://sunny-roan-pi.vercel.app/cat-3d.html";

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


function HomeContent({ caseStudies, upcomingEvents, locale }: { caseStudies: CaseStudy[]; upcomingEvents: CMSEvent[]; locale: string }) {
  const t = useTranslations("Home");
  const ts = useTranslations("Services");
  const tc = useTranslations("CaseStudies");
  const tw = useTranslations("Workshop");
  const td = useTranslations("DoubleDiamond");


  return (
    <div className="flex flex-col flex-1 bg-white">
      <h1 className="sr-only">ProtoA — DXコンサルティング</h1>
      {/* ===================== MOBILE ===================== */}
      <div className="sm:hidden px-4 py-6 flex flex-col gap-4 bg-muted">
        {/* Hero video */}
        <div className="relative rounded-2xl overflow-hidden aspect-[9/16]">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src="/videos/hero-mobile.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50" />
          <div className="relative z-10 flex flex-col justify-center h-full p-6">
            <p className="text-xl font-medium text-white leading-relaxed whitespace-pre-line">
              {t("hero.tagline")}
            </p>
          </div>
        </div>

        {/* Story */}
        <div className="rounded-2xl bg-white py-8 px-6">
          <h2 className="text-2xl font-bold text-foreground text-center mb-6">
            {t("story.label")}
          </h2>

          {/* Ayaka's story */}
          <div>
            <div className="mb-6">
              <div className="relative float-left mr-1 mb-2 h-44 w-44 overflow-hidden rounded-2xl">
                <div className="absolute left-2 top-2 h-28 w-28 rounded-[42%_58%_63%_37%/45%_42%_58%_55%] bg-[#eaad63] rotate-[8deg]" />
                <div className="absolute left-0 bottom-0 h-16 w-16 rounded-full bg-[#eaad63]/50" />
                <Image src={t("story.ayaka.photos.child")} alt="" fill className="object-contain object-right-top -translate-x-3" />
              </div>
              <p className="text-sm text-muted-foreground leading-[1.8] whitespace-pre-line">
                {t("story.ayaka.bio")}
              </p>
            </div>
            <div className="clear-both flex flex-col">
              {(t.raw("story.ayaka.milestones") as { date: string; text: string }[]).map((m, i, arr) => (
                <div key={m.date} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span className="h-2.5 w-2.5 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                    {i < arr.length - 1 && <span className="w-px flex-1 bg-primary/20" />}
                  </div>
                  <div className="pb-4">
                    <p className="text-xs font-bold text-primary">{m.date}</p>
                    <p className="text-sm text-foreground">{m.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-stretch justify-end min-h-[220px]">
              <p className={`${yomogi.className} flex-1 min-w-0 self-end pb-16 text-right text-lg text-foreground whitespace-nowrap`}>
                {t("story.ayaka.motto")}
              </p>
              <div className="relative -mr-10 ml-auto w-80 flex-shrink-0 z-0">
                <div className="absolute right-4 top-2 h-44 w-44 rounded-[58%_42%_37%_63%/55%_58%_42%_45%] bg-[#eaad63] -rotate-[10deg]" />
                <div className="absolute right-0 bottom-6 h-20 w-20 rounded-full bg-[#eaad63]/50" />
                <Image src={t("story.ayaka.photos.adult")} alt="" fill className="object-contain object-right-bottom" />
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming event tile */}
        {upcomingEvents.length > 0 && (() => {
          const nextEvent = upcomingEvents[0];
          return (
            <Link
              href={`/events/${nextEvent.id}` as "/events"}
              className="relative rounded-2xl bg-gradient-to-br from-[#eaad63]/10 to-[#eaad63]/20 border border-[#eaad63]/25 p-5 flex items-center gap-4 group hover:shadow-md transition-shadow"
            >
              <span className="absolute -top-3 -right-3 z-10 flex h-14 w-14 items-center justify-center">
                <span className="absolute inset-0 rounded-full bg-[#bc441a] shadow-lg heartbeat" />
                <span className="relative text-xs font-bold uppercase tracking-wider text-white">NEW</span>
              </span>
              <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                <h3 className="text-lg font-bold text-foreground leading-snug">
                  {nextEvent.title}
                </h3>
                {nextEvent.description && (
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {nextEvent.description}
                  </p>
                )}
                <span className="flex items-start gap-1.5 text-sm text-muted-foreground mt-2">
                  <CalendarDays size={14} className="text-primary flex-shrink-0 mt-[3px]" />
                  {new Date(nextEvent.date).toLocaleDateString(locale === "ja" ? "ja-JP" : "en-US", {
                    month: "long",
                    day: "numeric",
                    weekday: "short",
                  })}
                </span>
                {nextEvent.location && (
                  <span className="flex items-start gap-1.5 text-sm text-muted-foreground">
                    <MapPin size={14} className="text-primary flex-shrink-0 mt-[3px]" />
                    {nextEvent.location}
                  </span>
                )}
              </div>
              <ChevronRight size={18} className="text-primary/40 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
            </Link>
          );
        })()}

        {/* Double Diamond storytelling */}
        <div className="pt-6 pb-2 text-center">
          <p className="text-2xl font-bold text-foreground">
            {td("sectionTitle")}
          </p>
          <a
            href="https://www.designcouncil.org.uk/our-resources/the-double-diamond/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-block text-xs text-muted-foreground underline decoration-muted-foreground/40 underline-offset-2"
          >
            {td("frameworkLabel")}
          </a>
        </div>
        <DoubleDiamond />

        {/* Free Workshop CTA */}
        <Link
          href="/services"
          className="rounded-2xl bg-gradient-to-br from-primary/5 to-primary/15 border border-primary/25 p-5 flex flex-col items-center gap-3 group hover:shadow-md transition-shadow"
        >
          <h3 className="text-2xl font-bold text-foreground leading-snug text-center" style={{ letterSpacing: "0.1em" }}>
            {tw.rich("homeTile.title", {
              emphasis: (chunks) => <span className="text-primary underline decoration-primary decoration-2 underline-offset-4">{chunks}</span>,
            })}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed text-center">
            {tw("homeTile.subtitle")}
          </p>
          <span className="mt-1 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white">
            {tw("homeTile.cta")}
          </span>
        </Link>

        {/* Case Studies link */}
        <Link
          href="/case-studies"
          className="rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/15 p-5 flex items-center gap-4 group"
        >
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-foreground">{tc("title")}</p>
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

        {/* Sunny link */}
        <a
          href={SUNNY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="relative rounded-2xl bg-primary/10 border border-primary/20 p-5 flex items-center gap-4 group"
        >
          <span className="absolute -top-2 -right-2 z-10 rounded-full bg-gray-700 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
            {t("sunny.badge")}
          </span>
          <div className="flex-1 min-w-0 flex items-center gap-2.5">
            <p className="text-base font-bold text-foreground">{t("sunny.cta")}</p>
          </div>
          <Image
            src="/images/sunny-face.png"
            alt=""
            width={48}
            height={48}
            className="h-12 w-12 rounded-full border-2 border-white shadow-sm flex-shrink-0 object-cover"
          />
          <ChevronRight size={18} className="text-primary/40 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
        </a>

        {/* Logo + Taglines */}
        <Image src="/logo_mark.svg" alt="ProtoA" width={48} height={48} className="h-12 w-12 mx-auto mt-4" />
        <ul className="flex flex-col gap-1 text-center py-4">
          {(t.raw("taglines") as string[]).map((line: string, i: number) => (
            <li key={i} className="text-lg font-bold text-foreground">
              {line}
            </li>
          ))}
        </ul>
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
              solutionBrand={t("solution.titleBrand")}
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
                      </div>
                    </Link>
                  )}
                </div>
              }
              blogSlot={
                <div className="rounded-3xl bg-[#f0e6d3] p-5 flex flex-col items-center justify-center gap-3 min-h-[160px]">
                  <Link href="/blog" className="group">
                    <span className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-foreground shadow-sm flex items-center gap-3 hover:shadow-md transition-shadow">
                      {t("blog.moreLabel")}
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                  </Link>
                  <a href={SUNNY_URL} target="_blank" rel="noopener noreferrer" className="group relative">
                    <span className="absolute -top-2 -right-2 z-10 rounded-full bg-gray-700 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                      {t("sunny.badge")}
                    </span>
                    <span className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-sm flex items-center gap-3 hover:bg-primary-dark hover:shadow-md transition-all">
                      <PawPrint size={16} />
                      {t("sunny.cta")}
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                  </a>
                </div>
              }
            />
          </div>
        </section>

        {/* Story */}
        <section className="px-4 pt-12">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-3xl bg-white p-10 lg:p-14">
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground text-center mb-10">
                {t("story.label")}
              </h2>

              {/* Ayaka's story */}
              <div className="mx-auto max-w-5xl">
                <div className="flex flex-col sm:flex-row gap-10">
                  <div className="flex sm:flex-col items-center gap-4 flex-shrink-0">
                    <div className="relative h-32 w-32 rounded-2xl overflow-hidden bg-[#e9f0f0]">
                      <Image src={t("story.ayaka.photos.child")} alt="" fill sizes="128px" className="object-cover object-top" />
                    </div>
                    <div className="relative h-32 w-32 rounded-2xl overflow-hidden bg-[#e9f0f0]">
                      <Image src={t("story.ayaka.photos.adult")} alt="" fill sizes="128px" className="object-cover object-top" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-foreground">{t("story.ayaka.label")}</h3>
                    <p className="mt-3 text-base text-muted-foreground leading-relaxed">
                      {t("story.ayaka.bio")}
                    </p>
                    <div className="mt-6 flex flex-col">
                      {(t.raw("story.ayaka.milestones") as { date: string; text: string }[]).map((m, i, arr) => (
                        <div key={m.date} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <span className="h-2.5 w-2.5 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                            {i < arr.length - 1 && <span className="w-px flex-1 bg-primary/20" />}
                          </div>
                          <div className="pb-5">
                            <p className="text-sm font-bold text-primary">{m.date}</p>
                            <p className="text-base text-foreground">{m.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Double Diamond */}
        <section className="px-4 pt-12">
          <div className="mx-auto max-w-7xl">
            <DoubleDiamondDesktop />
          </div>
        </section>

        {/* Free Workshop Gateway */}
        <section className="px-4 pt-12">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-3xl bg-gradient-to-br from-primary/5 to-primary/15 border border-primary/20 p-10 flex flex-col sm:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">
                    {tw("badge")}
                  </span>
                  <span className="text-sm font-medium text-primary">
                    {tw("homeTile.label")}
                  </span>
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
                  {tw.rich("homeTile.title", {
                    emphasis: (chunks) => <span className="text-primary">{chunks}</span>,
                  })}
                </h2>
                <p className="mt-3 text-base text-muted-foreground max-w-lg">
                  {tw("homeTile.subtitle")}
                </p>
                <Link
                  href="/services"
                  className="mt-5 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-primary-dark transition-colors"
                >
                  {tw("homeTile.cta")}
                </Link>
              </div>
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex items-center gap-3">
                  <span className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">0</span>
                  <span className="font-bold text-foreground">{tw("flow.step0")}</span>
                </div>
                <div className="ml-4 h-6 border-l-2 border-primary/30" />
                <div className="flex items-center gap-3">
                  <span className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">1</span>
                  <span className="text-muted-foreground">{tw("flow.step1")}</span>
                </div>
                <div className="ml-4 h-6 border-l-2 border-primary/30" />
                <div className="flex items-center gap-3">
                  <span className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">2</span>
                  <span className="text-muted-foreground">{tw("flow.step2")}</span>
                </div>
              </div>
            </div>
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

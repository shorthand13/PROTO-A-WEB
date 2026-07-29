import { useTranslations } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { WORKSHOP_BOOKING_URL } from "@/lib/social-links";
import { generatePageMetadata } from "@/lib/metadata";
import ServicePhotoCarousel from "@/components/ServicePhotoCarousel";
import { ClipboardList, Workflow, Handshake, NotebookPen, Receipt, BookOpen, PenLine, Sparkles, AppWindow, GraduationCap, ChevronDown, Star } from "lucide-react";

const threeServices = ["agency", "training", "pmo"] as const;
const testimonialCompanies = ["goya", "kohagura", "sakishima"] as const;

const contentIcons = {
  pmo: [ClipboardList, Workflow, Handshake, NotebookPen],
  agency: [Receipt, BookOpen, PenLine],
  training: [Sparkles, AppWindow, GraduationCap],
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Services" });
  return generatePageMetadata({
    locale,
    title: t("title"),
    description: t("subtitle"),
    path: "/services",
  });
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ServicesContent />;
}

function ServicesContent() {
  const t = useTranslations("Services");
  const tw = useTranslations("Workshop");

  return (
    <div>
      {/* Hero */}
      <section className="px-4 pt-4 sm:pt-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="relative w-full sm:max-w-[420px] sm:mx-auto pt-4">
            <ServicePhotoCarousel
              photos={[
                "/photos/ayaka_service_top.jpg",
                "/photos/ayaka_service_top_1.jpg",
                "/photos/ayaka_service_top_2.jpg",
                "/photos/ayaka_service_top_3.jpg",
              ]}
              quote={t("heroQuote")}
              quotePhotoIndex={0}
            />
          </div>
        </div>
      </section>

      {/* 3つのサービス */}
      <section className="px-4 py-10 sm:py-16 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <p className="text-2xl font-bold text-foreground text-center mb-12 max-w-xl mx-auto whitespace-pre-line">
            {t("threeServices.subtitle.lead")}
          </p>
          <div className="relative mb-16 pb-8 max-w-xl mx-auto">
            {/* Ambient glow */}
            <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
              <div className="h-80 w-80 sm:h-96 sm:w-96 rounded-full bg-[#eaad63]/35 blur-2xl" />
            </div>
            {/* Tiny drifting bubbles */}
            <span className="pointer-events-none absolute left-[6%] top-0 h-10 w-10 rounded-full bg-[#eaad63]/70 ring-2 ring-white/60 float-bubble" />
            <span className="pointer-events-none absolute right-[8%] top-6 h-7 w-7 rounded-full bg-[#eaad63]/60 ring-2 ring-white/60 float-bubble-delay" />
            <span className="pointer-events-none absolute left-[16%] bottom-0 h-5 w-5 rounded-full bg-[#eaad63]/60 ring-2 ring-white/60 float-bubble" />
            <span className="pointer-events-none absolute right-[18%] bottom-4 h-12 w-12 rounded-full bg-[#eaad63]/50 ring-2 ring-white/60 float-bubble-delay" />
            <span className="pointer-events-none absolute left-[45%] top-10 h-3 w-3 rounded-full bg-[#eaad63]/70 ring-2 ring-white/60 float-bubble" />
            <span className="pointer-events-none absolute left-[2%] bottom-10 h-7 w-7 rounded-full bg-[#eaad63]/50 ring-2 ring-white/60 float-bubble-delay" />
            <span className="pointer-events-none absolute right-[3%] top-16 h-5 w-5 rounded-full bg-[#eaad63]/60 ring-2 ring-white/60 float-bubble" />
            <span className="pointer-events-none absolute left-[35%] bottom-[-6px] h-2 w-2 rounded-full bg-[#eaad63]/70 ring-2 ring-white/60 float-bubble-delay" />
            <span className="pointer-events-none absolute right-[38%] top-2 h-2.5 w-2.5 rounded-full bg-[#eaad63]/60 ring-2 ring-white/60 float-bubble" />
            <span className="pointer-events-none absolute right-[45%] bottom-8 h-8 w-8 rounded-full bg-[#eaad63]/40 ring-2 ring-white/60 float-bubble-delay" />

            <div className="relative flex flex-wrap items-center justify-center gap-4">
              {(t.raw("threeServices.subtitle.quotes") as string[]).map((quote, i) => (
                <button
                  key={i}
                  type="button"
                  className={`flex flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#eaad63]/80 to-[#eaad63] p-4 text-center font-bold leading-snug text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.35)] shadow-sm select-none ${
                    i === 1
                      ? "h-32 w-32 sm:h-40 sm:w-40 text-sm sm:text-base mt-28 float-bubble-delay"
                      : "h-44 w-44 sm:h-52 sm:w-52 text-lg sm:text-xl float-bubble"
                  }`}
                >
                  {quote}
                </button>
              ))}
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground text-center mb-8 whitespace-pre-line">
            {t("threeServices.supportLine")}
          </p>
          <div className="relative -mx-4 sm:mx-0">
            <div className="flex sm:grid sm:grid-cols-3 gap-6 overflow-x-auto snap-x snap-mandatory sm:overflow-visible px-4 sm:px-0 pb-4 sm:pb-0">
              {threeServices.map((key) => {
              return (
                <div
                  key={key}
                  className="relative overflow-hidden rounded-2xl p-6 flex flex-col gap-4 bg-primary shadow-md flex-shrink-0 w-[78vw] max-w-[300px] snap-center sm:w-auto sm:max-w-none"
                >
                  {key !== "agency" && (
                    <div className="absolute -right-14 top-7 w-56 rotate-45 bg-[#eaad63] py-1.5 text-center text-xs font-extrabold tracking-tight text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.4)] shadow-md whitespace-nowrap">
                      {t("threeServices.ribbon")}
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xl sm:text-2xl text-white leading-none whitespace-nowrap">
                      {key !== "agency" && "*"}
                      {t(`threeServices.items.${key}.price`)}
                      {key === "agency" && (
                        <span className="text-xs font-normal">{t("threeServices.items.agency.priceUnit")}</span>
                      )}
                    </p>
                    {key === "agency" && (
                      <p className="text-xl sm:text-2xl text-white leading-none text-right whitespace-nowrap">
                        {t("threeServices.items.agency.altPrice")}
                        <span className="text-xs font-normal">{t("threeServices.items.agency.altPriceUnit")}</span>
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-0.5 mt-3">
                    <h3 className="text-lg sm:text-xl text-white leading-snug">
                      {t(`threeServices.items.${key}.title`)}
                    </h3>
                    <p className="text-sm text-white/90 leading-relaxed">
                      {t(`threeServices.items.${key}.tagline`)}
                    </p>
                  </div>
                  <ul className="flex flex-col gap-2">
                    {(t.raw(`threeServices.items.${key}.forWho`) as string[]).map((line, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm font-bold text-white/85">
                        <span className="mt-[0.6em] h-px w-4 shrink-0 bg-white/60" />
                        {line}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto">
                    <p className="text-sm text-white mb-1 pl-2">
                      {t("threeServices.contentLabel")}
                    </p>
                    <ul className="rounded-xl bg-white p-3 flex flex-col gap-2.5">
                      {(t.raw(`threeServices.items.${key}.content`) as string[]).map((line, i) => {
                        const Icon = contentIcons[key][i];
                        return (
                          <li key={i} className="flex items-center gap-6 text-xs text-foreground leading-relaxed">
                            <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                              {Icon && <Icon className="h-2.5 w-2.5 text-primary" />}
                            </span>
                            {line}
                          </li>
                        );
                      })}
                    </ul>
                    {key !== "agency" && (
                      <p className="mt-2 text-[10px] text-white/60 leading-snug">
                        *{t("threeServices.priceNote")}
                      </p>
                    )}
                  </div>
                </div>
              );
              })}
            </div>
            <div className="pointer-events-none absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-white to-transparent sm:hidden" />
          </div>
        </div>
      </section>


      {/* Workshop CTA */}
      <section id="workshop" className="px-4 pb-10 sm:pb-16 scroll-mt-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="relative rounded-2xl bg-[#f8f6f3] p-6 sm:p-10 flex flex-col items-center text-center">
            <span className="absolute -top-5 -right-3 z-10 flex h-14 w-14 items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-[#bc441a] shadow-lg heartbeat" />
              <span className="relative text-xs font-bold text-white">{tw("badge")}</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mt-4">
              {t("workshopSection.title")}
            </h2>
            <p className="mt-3 text-sm font-bold text-foreground">
              {t("workshopSection.subtitle")}
            </p>
            <ul className="mt-4 space-y-3 text-left w-full max-w-sm">
              {(t.raw("workshopSection.features") as string[]).map((feature: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-[0.6em] h-px w-4 shrink-0 bg-muted-foreground/60" />
                  {feature}
                </li>
              ))}
            </ul>
            <div className="mt-6 w-full max-w-sm border-t border-border pt-6 flex flex-col items-center">
              <div className="w-full">
                <h3 className="text-sm font-bold text-foreground text-center mb-3">
                  {t("workshopSection.testimonials.title")}
                </h3>
                <div className="flex flex-col gap-3">
                  {testimonialCompanies.map((key) => {
                    return (
                      <details key={key} className="group rounded-2xl bg-white border border-border overflow-hidden">
                        <summary className="flex items-center justify-between px-4 py-3 cursor-pointer list-none font-bold text-sm text-foreground">
                          {t(`workshopSection.testimonials.items.${key}.name`)}
                          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
                        </summary>
                        <div className="px-4 pb-4">
                          <p className="text-xs text-muted-foreground mb-2">
                            <a
                              href={t(`workshopSection.testimonials.items.${key}.siteUrl`)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary underline underline-offset-2"
                            >
                              {t(`workshopSection.testimonials.items.${key}.captionLinked`)}
                            </a>
                            {t(`workshopSection.testimonials.items.${key}.captionRest`)}
                          </p>
                          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden">
                            <Image
                              src={t(`workshopSection.testimonials.items.${key}.photo`)}
                              alt={t(`workshopSection.testimonials.items.${key}.caption`)}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <p className="mt-3 text-xs text-muted-foreground text-center leading-relaxed">
                            {t(`workshopSection.testimonials.items.${key}.founded`)}
                            <br />
                            {t(`workshopSection.testimonials.items.${key}.industry`)}
                            <br />
                            {t(`workshopSection.testimonials.items.${key}.employees`)}
                          </p>
                          <div className="mt-2 flex items-center justify-start gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-[#eaad63] text-[#eaad63]" />
                            ))}
                          </div>
                          <p className="mt-3 text-xs text-foreground text-left italic leading-relaxed">
                            "{t(`workshopSection.testimonials.items.${key}.quote`)}"
                          </p>
                          <div className="mt-4 flex items-center gap-3">
                            <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-muted">
                              <Image
                                src={t(`workshopSection.testimonials.items.${key}.commenterPhoto`)}
                                alt={t(`workshopSection.testimonials.items.${key}.commenterName`)}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="text-left">
                              <p className="text-xs text-foreground">
                                {t(`workshopSection.testimonials.items.${key}.commenterName`)}
                              </p>
                              <p className="text-[11px] text-muted-foreground">
                                {t(`workshopSection.testimonials.items.${key}.commenterRole`)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </details>
                    );
                  })}
                </div>
              </div>

              <a
                href={WORKSHOP_BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center justify-center rounded-full bg-primary px-16 py-4 text-lg font-bold text-white hover:bg-primary-dark transition-colors shadow-sm"
              >
                {t("workshopSection.cta")}
              </a>

              <p className="mt-8 mb-1 text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {t("workshopSection.note")}
              </p>
              <Link
                href="/contact"
                className="mt-1 text-sm text-foreground underline underline-offset-4 decoration-muted-foreground/50"
              >
                {t("workshopSection.noteLink")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

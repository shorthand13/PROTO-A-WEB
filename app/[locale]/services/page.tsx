import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { GraduationCap, Handshake, Monitor, Settings, Workflow } from "lucide-react";

const flagshipServices = [
  { key: "training", icon: GraduationCap, tag: { ja: "研修", en: "Training" } },
  { key: "accompaniment", icon: Handshake, tag: { ja: "伴走支援", en: "Hands-on DX Support" } },
] as const;

const upcomingServices = [
  { key: "onlineSupport", icon: Monitor },
  { key: "toolSelection", icon: Settings },
  { key: "workflow", icon: Workflow },
] as const;

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ServicesContent locale={locale} />;
}

function ServicesContent(props: { locale: string }) {
  const { locale } = props;
  const t = useTranslations("Services");

  return (
    <div>
      {/* Page Header */}
      <section className="bg-background px-4 pt-8 pb-4 sm:pt-12 sm:pb-6 text-foreground">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h1 className="text-2xl sm:text-3xl font-bold">{t("title")}</h1>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-muted-foreground">{t("subtitle")}</p>
        </div>
      </section>

      {/* Flagship Services */}
      <section className="py-4 sm:py-8 px-4">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {flagshipServices.map(({ key, icon: Icon, tag }) => (
              <div
                key={key}
                className="rounded-xl sm:rounded-2xl border border-primary/40 sm:border-2 sm:border-primary bg-white p-4 sm:p-6 shadow-sm flex flex-col"
              >
                <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
                  <div className="inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-primary-light/30">
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <h2 className="text-base sm:text-xl font-bold text-foreground leading-tight">
                    {t(`${key}.title`)}
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {t(`${key}.description`)}
                </p>
                <ul className="mt-3 sm:mt-4 space-y-1 sm:space-y-1.5 flex-1">
                  {(t.raw(`${key}.features`) as string[]).map(
                    (feature: string, i: number) => (
                      <li
                        key={i}
                        className="flex items-start gap-1.5 text-xs sm:text-sm text-foreground"
                      >
                        <svg
                          className="mt-0.5 h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-primary"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {feature}
                      </li>
                    )
                  )}
                </ul>
                <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-2.5 sm:gap-3">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 sm:px-6 sm:py-3 text-sm font-bold text-white hover:bg-primary-dark transition-colors"
                  >
                    {t("cta")}
                  </Link>
                  <Link
                    href={`/case-studies?tag=${encodeURIComponent(tag[locale as "ja" | "en"] ?? tag.ja)}` as "/case-studies"}
                    className="inline-flex items-center justify-center rounded-full border border-primary px-5 py-2.5 sm:px-6 sm:py-3 text-sm font-bold text-primary hover:bg-primary/5 transition-colors"
                  >
                    {t("viewCaseStudies")} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Services */}
      <section className="pb-10 sm:pb-16 px-4">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h3 className="text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-widest mb-3 sm:mb-4">
            {t("upcoming.title")}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {upcomingServices.map(({ key, icon: Icon }) => (
              <div
                key={key}
                className="rounded-lg sm:rounded-xl border border-border bg-surface p-4 sm:p-5 opacity-75"
              >
                <div className="flex items-center gap-2.5 sm:gap-3 mb-1.5 sm:mb-2">
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  <span className="text-[10px] font-medium text-muted-foreground border border-border rounded-full px-2 py-0.5">
                    {t("upcoming.badge")}
                  </span>
                </div>
                <h4 className="font-bold text-foreground text-xs sm:text-sm">
                  {t(`${key}.title`)}
                </h4>
                <p className="mt-1 text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                  {t(`${key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeContent />;
}

function HomeContent() {
  const t = useTranslations("Home");

  return (
    <div className="flex flex-col flex-1">
      {/* Section 1: The Problem */}
      <section className="min-h-screen flex items-center justify-center px-4 bg-foreground text-white">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-white/50 text-sm tracking-widest uppercase mb-6">
            {t("problem.label")}
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight whitespace-pre-line">
            {t("problem.title")}
          </h1>
          <p className="mt-8 text-lg text-white/70 leading-relaxed max-w-xl mx-auto whitespace-pre-line">
            {t("problem.subtitle")}
          </p>
          <div className="mt-12 flex justify-center">
            <svg
              className="h-8 w-8 text-white/30 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* Section 2: Pain Points */}
      <section className="min-h-screen flex items-center px-4 py-20 bg-white">
        <div className="mx-auto max-w-5xl w-full">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-16">
            {t("painPoints.title")}
          </h2>
          <div className="space-y-8">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-6 rounded-2xl border border-border p-6 sm:p-8"
              >
                <span className="text-4xl shrink-0">
                  {t(`painPoints.items.${i}.icon`)}
                </span>
                <p className="text-lg sm:text-xl font-medium text-foreground">
                  {t(`painPoints.items.${i}.text`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: The Solution */}
      <section className="min-h-screen flex items-center px-4 bg-primary text-white">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-white/50 text-sm tracking-widest uppercase mb-6">
            {t("solution.label")}
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight whitespace-pre-line">
            {t("solution.title")}
          </h2>
          <p className="mt-8 text-lg text-white/80 leading-relaxed max-w-xl mx-auto whitespace-pre-line">
            {t("solution.subtitle")}
          </p>
        </div>
      </section>

      {/* Section 4: Services */}
      <section className="min-h-screen flex items-center px-4 py-20 bg-white">
        <div className="mx-auto max-w-7xl w-full">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
            {t("services.title")}
          </h2>
          <p className="text-center text-muted-foreground mb-16">
            {t("services.subtitle")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {(
              ["consulting", "onlineSupport", "toolSelection", "workflow"] as const
            ).map((service) => (
              <div
                key={service}
                className="rounded-2xl border border-border p-8 hover:shadow-lg transition-shadow"
              >
                <span className="text-4xl">
                  {service === "consulting" && "💬"}
                  {service === "onlineSupport" && "🖥️"}
                  {service === "toolSelection" && "🔧"}
                  {service === "workflow" && "⚡"}
                </span>
                <h3 className="mt-4 text-xl font-bold">
                  {t(`services.${service}.title`)}
                </h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  {t(`services.${service}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Testimonials */}
      <section className="min-h-[80vh] flex items-center px-4 py-20 bg-surface">
        <div className="mx-auto max-w-5xl w-full">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-16">
            {t("testimonials.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-2xl bg-background p-8 shadow-sm">
                <p className="text-foreground italic leading-relaxed">
                  &ldquo;{t(`testimonials.items.${i}.quote`)}&rdquo;
                </p>
                <div className="mt-6 border-t border-border pt-4">
                  <p className="font-bold">
                    {t(`testimonials.items.${i}.name`)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t(`testimonials.items.${i}.business`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6: CTA */}
      <section className="min-h-[60vh] flex items-center justify-center px-4 bg-foreground text-white">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold">
            {t("cta.title")}
          </h2>
          <p className="mt-6 text-lg text-white/70 max-w-lg mx-auto">
            {t("cta.subtitle")}
          </p>
          <Link
            href="/contact"
            className="mt-10 inline-flex items-center justify-center rounded-full bg-primary px-10 py-5 text-xl font-bold text-white shadow-lg hover:bg-primary-dark transition-colors"
          >
            {t("cta.button")}
          </Link>
        </div>
      </section>
    </div>
  );
}

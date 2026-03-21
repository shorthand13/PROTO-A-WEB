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
  const tNav = useTranslations("Navigation");

  return (
    <div className="flex flex-col flex-1">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary via-primary-dark to-ocean-dark px-4 py-24 sm:py-32 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight whitespace-pre-line">
            {t("hero.title")}
          </h1>
          <p className="mt-6 max-w-2xl text-lg sm:text-xl text-white/90">
            {t("hero.subtitle")}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-cta px-8 py-4 text-lg font-bold text-white shadow-lg hover:bg-cta-light transition-colors"
            >
              {t("hero.cta")}
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center rounded-full border-2 border-white px-8 py-4 text-lg font-bold text-white hover:bg-white/10 transition-colors"
            >
              {t("hero.secondaryCta")}
            </Link>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 px-4 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              {t("services.title")}
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              {t("services.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(
              ["consulting", "onlineSupport", "toolSelection", "workflow"] as const
            ).map((service) => (
              <div
                key={service}
                className="rounded-2xl border border-border bg-background p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light/30">
                  <span className="text-2xl text-primary">
                    {service === "consulting" && "💬"}
                    {service === "onlineSupport" && "🖥️"}
                    {service === "toolSelection" && "🔧"}
                    {service === "workflow" && "⚡"}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  {t(`services.${service}.title`)}
                </h3>
                <p className="mt-2 text-muted-foreground">
                  {t(`services.${service}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              {t("testimonials.title")}
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              {t("testimonials.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="rounded-2xl bg-background p-6 shadow-sm"
              >
                <p className="text-foreground italic leading-relaxed">
                  &ldquo;{t(`testimonials.items.${i}.quote`)}&rdquo;
                </p>
                <div className="mt-4 border-t border-border pt-4">
                  <p className="font-bold text-foreground">
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
    </div>
  );
}

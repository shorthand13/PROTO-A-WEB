import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Users, MapPin, Heart } from "lucide-react";
import TeamSection from "@/components/TeamSection";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AboutContent />;
}

function AboutContent() {
  const t = useTranslations("About");

  return (
    <div>
      {/* Page Header */}
      <section className="border-b border-border bg-background px-4 py-16 sm:py-20 text-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold">{t("title")}</h1>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light/30">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {t("mission.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("mission.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-16 px-4 bg-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-cta/20">
              <MapPin className="h-6 w-6 text-cta" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {t("whyUs.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("whyUs.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent-light/30">
              <Users className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {t("team.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t("team.description")}
              </p>
              <TeamSection />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

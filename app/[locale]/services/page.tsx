import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { MessageSquare, Monitor, Settings, Workflow } from "lucide-react";

const services = [
  { key: "consulting", icon: MessageSquare },
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

  return <ServicesContent />;
}

function ServicesContent() {
  const t = useTranslations("Services");

  return (
    <div>
      {/* Page Header */}
      <section className="border-b border-border bg-background px-4 py-16 sm:py-20 text-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold">{t("title")}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{t("subtitle")}</p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map(({ key, icon: Icon }) => (
              <div
                key={key}
                className="rounded-2xl border border-border bg-background p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary-light/30">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  {t(`${key}.title`)}
                </h3>
                <p className="mt-3 text-muted-foreground">
                  {t(`${key}.description`)}
                </p>
                <ul className="mt-6 space-y-2">
                  {(
                    t.raw(`${key}.features`) as string[]
                  ).map((feature: string, i: number) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className="mt-6 inline-flex items-center justify-center rounded-full bg-cta px-6 py-3 text-sm font-bold text-white hover:bg-cta-light transition-colors"
                >
                  {t("cta")}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

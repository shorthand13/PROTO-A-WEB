import { useTranslations } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { WORKSHOP_BOOKING_URL } from "@/lib/social-links";
import { generatePageMetadata } from "@/lib/metadata";

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

const processSteps = [
  { key: "discover", image: "/photos/process-1.png" },
  { key: "define", image: "/photos/process-2.png" },
  { key: "develop", image: "/photos/process-3.png" },
  { key: "deliver", image: "/photos/process-4.png" },
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
  const tw = useTranslations("Workshop");

  return (
    <div>
      {/* Page Header */}
      <section className="bg-background px-4 pt-8 pb-2 sm:pt-12 sm:pb-6 text-foreground">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h1 className="text-2xl sm:text-3xl font-bold">{t("title")}</h1>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-muted-foreground">{t("subtitle")}</p>
        </div>
      </section>

      {/* Hero Image */}
      <section className="px-4 pt-4 sm:pt-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="relative w-full sm:max-w-[500px] sm:mx-auto aspect-[16/9] rounded-xl overflow-hidden">
            <Image
              src="/photos/service-pointing.png"
              alt=""
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Brand Values — Venn Diagram */}
      <section className="px-4 py-10 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 flex flex-col items-center">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground text-center mb-8">
            {t("brandTitle")}
          </h2>
          <Image
            src="/photos/3-element.svg"
            alt={t("brandTitle")}
            width={300}
            height={240}
            className="w-[240px] sm:w-[300px] h-auto"
          />
        </div>
      </section>

      {/* 4-Step Process */}
      <section className="px-4 pb-10 sm:pb-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground text-center mb-8">
            {t("processTitle")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10">
            {processSteps.map(({ key, image }) => (
              <div key={key} className="flex flex-col gap-3">
                <h3 className="text-lg sm:text-xl font-bold text-foreground">
                  {t(`process.${key}.step`)}. {t(`process.${key}.title`)}
                </h3>
                <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden">
                  <Image
                    src={image}
                    alt={t(`process.${key}.title`)}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(`process.${key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workshop CTA */}
      <section className="px-4 pb-10 sm:pb-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="relative rounded-2xl bg-[#f8f6f3] p-6 sm:p-10 flex flex-col items-center text-center">
            <span className="absolute -top-5 -right-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#bc441a] text-xs font-bold text-white shadow-md z-10">
              {tw("badge")}
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
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <div className="mt-6 w-full max-w-sm border-t border-border pt-6 flex flex-col items-center">
              <a
                href={WORKSHOP_BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-primary px-16 py-4 text-lg font-bold text-white hover:bg-primary-dark transition-colors shadow-sm"
              >
                {t("workshopSection.cta")}
              </a>
              <p className="mt-4 mb-1 text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
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

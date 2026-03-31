import { useTranslations } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Users, MapPin, Handshake } from "lucide-react";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import PhotoGallery from "@/components/PhotoGallery";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });
  return {
    title: t("title"),
    description: "ProtoAのチーム紹介とミッション。宮古島を拠点に中小企業のDX推進を支援しています。",
  };
}

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
      {/* ===================== MOBILE ===================== */}
      <div className="sm:hidden px-4 py-6 flex flex-col gap-3">
        {/* Mission */}
        <div className="rounded-2xl bg-[#eaad63] text-white p-8">
          <span className="rounded-full bg-white/30 backdrop-blur-sm px-3 py-1.5 text-xs font-bold">
            {t("mission.label")}
          </span>
          <h1 className="mt-4 text-2xl font-bold leading-tight whitespace-pre-line">
            {t("mission.statement")}
          </h1>
        </div>

        {/* Vision */}
        <div className="rounded-2xl bg-[#6b9e9e] text-white p-8">
          <span className="rounded-full bg-white/30 backdrop-blur-sm px-3 py-1.5 text-xs font-bold">
            {t("vision.label")}
          </span>
          <p className="mt-4 text-xl font-bold leading-tight whitespace-pre-line">
            {t("vision.statement")}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3" id="stats-section-mobile">
          {(["satisfaction", "companies", "participants", "seminars"] as const).map((key) => (
            <div key={key} className="rounded-2xl bg-muted p-5 text-center">
              <p className="text-2xl font-bold text-[#6b9e9e]">
                {t(`stats.${key}.value`)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {t(`stats.${key}.label`)}
              </p>
            </div>
          ))}
        </div>

        {/* What We Do tiles */}
        <div className="flex flex-col gap-3">
          {(["who", "what", "difference"] as const).map((key) => {
            const icons = { who: MapPin, what: Handshake, difference: Users };
            const Icon = icons[key];
            return (
              <div key={key} className="rounded-2xl bg-muted p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light/30">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground">
                    {t(`whatWeDo.${key}.label`)}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(`whatWeDo.${key}.description`)}
                </p>
              </div>
            );
          })}
        </div>

        {/* Gallery */}
        <div className="mt-2">
          <h2 className="text-lg font-bold text-foreground mb-4 px-1">
            {t("gallery.title")}
          </h2>
          <PhotoGallery />
        </div>

        {/* Team */}
        <div className="mt-2">
          <h2 className="text-lg font-bold text-foreground mb-4 px-1">
            {t("team.title")}
          </h2>
          <div className="flex flex-col gap-3">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="rounded-2xl bg-muted p-5 flex items-center gap-4"
              >
                <Image
                  src={member.photo}
                  alt={member.name}
                  width={96}
                  height={96}
                  className="h-16 w-16 rounded-full object-cover shrink-0"
                />
                <div>
                  <p className="font-bold text-foreground text-sm">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.roles}</p>
                </div>
              </div>
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
        {/* Mission + Vision row */}
        <section className="px-4 pt-8">
          <div className="mx-auto max-w-7xl grid grid-cols-7 gap-6">
            {/* Mission — large panel */}
            <div className="col-span-5 rounded-3xl bg-[#eaad63] text-white p-10 lg:p-14 flex flex-col justify-center min-h-[400px] relative overflow-hidden">
              <img
                src="/photos/about-decor-a.svg"
                alt=""
                aria-hidden="true"
                className="absolute top-0 right-0 h-full w-auto pointer-events-none select-none"
              />
              <span className="relative z-10 rounded-full bg-white/30 backdrop-blur-sm px-4 py-1.5 text-xs font-bold self-start">
                {t("mission.label")}
              </span>
              <h1 className="relative z-10 mt-6 text-3xl lg:text-4xl font-bold leading-tight whitespace-pre-line">
                {t("mission.statement")}
              </h1>
            </div>

            {/* Vision — side panel */}
            <div className="col-span-2 rounded-3xl bg-[#6b9e9e] text-white p-8 flex flex-col justify-center relative overflow-hidden">
              <img
                src="/photos/about-vision-decor-i.svg"
                alt=""
                aria-hidden="true"
                className="absolute top-0 right-0 h-full w-auto pointer-events-none select-none"
              />
              <span className="relative z-10 rounded-full bg-white/30 backdrop-blur-sm px-4 py-1.5 text-xs font-bold self-start">
                {t("vision.label")}
              </span>
              <p className="relative z-10 mt-6 text-xl lg:text-2xl font-bold leading-tight whitespace-pre-line">
                {t("vision.statement")}
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="px-4 pt-6" id="stats-section">
          <div className="mx-auto max-w-7xl grid grid-cols-4 gap-6">
            {(["satisfaction", "companies", "participants", "seminars"] as const).map((key) => (
              <div key={key} className="rounded-3xl bg-muted p-8 text-center">
                <p className="text-3xl lg:text-4xl font-bold text-[#6b9e9e]">
                  {t(`stats.${key}.value`)}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t(`stats.${key}.label`)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* What We Do — 3 tiles */}
        <section className="px-4 pt-6">
          <div className="mx-auto max-w-7xl grid grid-cols-3 gap-6">
            {(["who", "what", "difference"] as const).map((key) => {
              const icons = { who: MapPin, what: Handshake, difference: Users };
              const Icon = icons[key];
              return (
                <div
                  key={key}
                  className="rounded-3xl bg-muted p-8 flex flex-col"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex-shrink-0 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light/30">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-base font-bold text-foreground">
                      {t(`whatWeDo.${key}.label`)}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(`whatWeDo.${key}.description`)}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Gallery */}
        <section className="px-4 pt-6">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-2xl font-bold text-foreground mb-6 px-1">
              {t("gallery.title")}
            </h2>
            <PhotoGallery />
          </div>
        </section>

        {/* Team */}
        <section className="px-4 pt-6">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-2xl font-bold text-foreground mb-6 px-1">
              {t("team.title")}
            </h2>
            <div className="grid grid-cols-3 gap-6">
              {teamMembers.map((member) => (
                <div
                  key={member.name}
                  className="rounded-3xl bg-muted p-6 flex flex-col items-center text-center"
                >
                  <Image
                    src={member.photo}
                    alt={member.name}
                    width={96}
                    height={96}
                    className="h-24 w-24 rounded-full object-cover"
                  />
                  <p className="mt-4 font-bold text-foreground">{member.name}</p>
                  <p className="text-sm text-muted-foreground">{member.roles}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 py-12">
          <div className="mx-auto max-w-7xl text-center">
            <h2 className="text-2xl font-bold text-foreground">{t("cta.title")}</h2>
            <p className="mt-2 text-muted-foreground">{t("cta.subtitle")}</p>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-bold text-white shadow-lg hover:bg-primary-dark transition-colors"
            >
              {t("cta.button")}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

const teamMembers = [
  {
    name: "Ayaka Sunakawa",
    roles: "Chief Executive / Chief Sales",
    photo: "/photos/ayaka.jpg",
  },
  {
    name: "Genki Kurihara",
    roles: "Project Manager",
    photo: "/photos/genki.jpg",
  },
  {
    name: "Genryu Nema",
    roles: "Main Consultant",
    photo: "/photos/nema.jpg",
  },
];

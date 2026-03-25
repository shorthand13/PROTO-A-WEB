import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Users, MapPin, Heart } from "lucide-react";
import Image from "next/image";

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
      <section className="bg-background px-4 py-10 sm:py-20 text-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-4xl font-bold">{t("title")}</h1>
        </div>
      </section>

      {/* Mission */}
      <section className="py-8 sm:py-16 px-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 sm:gap-4 mb-4">
            <div className="flex-shrink-0 inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-primary-light/30">
              <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              {t("mission.title")}
            </h2>
          </div>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            {t("mission.description")}
          </p>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-8 sm:py-16 px-4 bg-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 sm:gap-4 mb-4">
            <div className="flex-shrink-0 inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-cta/20">
              <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-cta" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              {t("whyUs.title")}
            </h2>
          </div>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            {t("whyUs.description")}
          </p>
        </div>
      </section>

      {/* Team */}
      <section className="py-8 sm:py-16 px-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 sm:gap-4 mb-4">
            <div className="flex-shrink-0 inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-accent-light/30">
              <Users className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              {t("team.title")}
            </h2>
          </div>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            {t("team.description")}
          </p>
          <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                name: "Ayaka Sunakawa",
                roles: "Chief Executive / Chief Designer / Chief Sales",
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
            ].map((member) => (
              <div
                key={member.name}
                className="rounded-2xl bg-muted p-5 sm:p-6 flex sm:flex-col items-center sm:text-center gap-4 sm:gap-0"
              >
                <Image
                  src={member.photo}
                  alt={member.name}
                  width={96}
                  height={96}
                  className="h-16 w-16 sm:h-24 sm:w-24 sm:mx-auto rounded-full object-cover shrink-0"
                />
                <div>
                  <p className="sm:mt-4 font-bold text-foreground text-sm sm:text-base">
                    {member.name}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{member.roles}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

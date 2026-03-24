import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Users, MapPin, Heart } from "lucide-react";
import { FaInstagram, FaFacebook, FaLinkedin } from "react-icons/fa";
import { SiNote } from "react-icons/si";
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
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl">
                {[
                  {
                    name: "砂川 綾香",
                    role: "代表 / チーフデザイナー",
                    photo: "/ayaka.png",
                    socials: [
                      { label: "Instagram", href: "https://www.instagram.com/dummy_ayaka", icon: "instagram" },
                      { label: "note", href: "https://note.com/dummy_ayaka", icon: "note" },
                    ],
                  },
                  {
                    name: "根間 玄隆",
                    role: "コンサルタント",
                    photo: "/nema.png",
                    socials: [
                      { label: "Facebook", href: "https://www.facebook.com/dummy_nema", icon: "facebook" },
                    ],
                  },
                  {
                    name: "栗原 元気",
                    role: "プロジェクトマネージャー / ビジネスアナリスト / マーケター",
                    photo: "/genki.png",
                    socials: [
                      { label: "LinkedIn", href: "https://www.linkedin.com/in/dummy_genki", icon: "linkedin" },
                    ],
                  },
                ].map((member) => (
                  <div
                    key={member.name}
                    className="rounded-2xl bg-muted p-6 text-center"
                  >
                    <div className="mx-auto h-24 w-24 rounded-full overflow-hidden relative">
                      <Image
                        src={member.photo}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="mt-4 font-bold text-foreground">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                    <div className="mt-3 flex items-center justify-center gap-3">
                      {member.socials.map((s) => (
                        <a
                          key={s.label}
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={s.label}
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          {s.icon === "instagram" && <FaInstagram size={18} />}
                          {s.icon === "facebook" && <FaFacebook size={18} />}
                          {s.icon === "linkedin" && <FaLinkedin size={18} />}
                          {s.icon === "note" && <SiNote size={14} />}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

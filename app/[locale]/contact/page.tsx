import Image from "next/image";
import { useTranslations } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Clock, MessageCircle, CalendarDays } from "lucide-react";
import ContactForm from "@/components/contact/ContactForm";
import HubSpotMeetings from "@/components/HubSpotMeetings";
import { LINE_ADD_FRIEND_URL, LINE_QR_IMAGE_SRC } from "@/lib/social-links";
import { generatePageMetadata } from "@/lib/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Contact" });
  return generatePageMetadata({
    locale,
    title: t("title"),
    description: t("subtitle"),
    path: "/contact",
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ContactContent />;
}

function ContactContent() {
  const t = useTranslations("Contact");

  return (
    <div>
      {/* Page Header */}
      <section className="border-b border-border bg-background px-4 py-16 sm:py-20 text-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold">{t("title")}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{t("subtitle")}</p>
        </div>
      </section>

      {/* Meeting booking (embedded calendar) */}
      <section className="py-16 px-4 border-b border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <CalendarDays className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">
              {t("meeting.title")}
            </h2>
          </div>
          <p className="text-muted-foreground mb-6 max-w-2xl">
            {t("meeting.description")}
          </p>
          <div className="rounded-2xl border border-border bg-background overflow-hidden">
            <HubSpotMeetings src="https://meetings-na2.hubspot.com/genki-kurihara" />
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <ContactForm />
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* LINE */}
              <div className="rounded-2xl border border-border bg-background p-6">
                <div className="flex items-center gap-3 mb-4">
                  <MessageCircle className="h-6 w-6 text-[#06C755]" />
                  <h3 className="text-lg font-bold text-foreground">
                    {t("line.title")}
                  </h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  {t("line.description")}
                </p>
                <a
                  href={LINE_ADD_FRIEND_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mx-auto block w-fit rounded-lg border border-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-[#06C755] focus-visible:ring-offset-2"
                >
                  <Image
                    src={LINE_QR_IMAGE_SRC}
                    alt={t("line.qrAlt")}
                    width={160}
                    height={160}
                    unoptimized
                    className="h-40 w-40 rounded-lg border border-border bg-white object-contain shadow-sm transition hover:opacity-90"
                  />
                </a>
                <a
                  href={LINE_ADD_FRIEND_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex w-full items-center justify-center rounded-full bg-[#06C755] px-6 py-3 text-sm font-bold text-white hover:bg-[#05b34d] transition-colors"
                >
                  {t("line.addFriend")}
                </a>
              </div>

              {/* Business Hours */}
              <div className="rounded-2xl border border-border bg-background p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                  <h3 className="text-lg font-bold text-foreground">
                    {t("hours.title")}
                  </h3>
                </div>
                <div className="space-y-2 text-muted-foreground">
                  <p>{t("hours.weekdays")}</p>
                  <p>{t("hours.weekend")}</p>
                  <p className="text-sm mt-4">{t("hours.note")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Clock, MessageCircle } from "lucide-react";
import ContactForm from "@/components/contact/ContactForm";

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
                <div className="h-40 w-40 mx-auto rounded-lg bg-muted flex items-center justify-center text-sm text-muted-foreground">
                  LINE QR Code
                </div>
                <button className="mt-4 w-full rounded-full bg-[#06C755] px-6 py-3 text-sm font-bold text-white hover:bg-[#05b34d] transition-colors">
                  {t("line.addFriend")}
                </button>
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

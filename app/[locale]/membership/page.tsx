import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Play, CheckCircle } from "lucide-react";

export default async function MembershipPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <MembershipContent />;
}

function MembershipContent() {
  const t = useTranslations("Membership");

  return (
    <div>
      {/* Page Header */}
      <section className="bg-gradient-to-br from-primary to-primary-dark px-4 py-16 sm:py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold">{t("title")}</h1>
          <p className="mt-4 text-lg text-white/90">{t("subtitle")}</p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Benefits */}
          <div className="rounded-2xl border border-border bg-background p-8 shadow-sm">
            <Play className="mx-auto h-12 w-12 text-primary mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-6">
              {t("benefits.title")}
            </h2>
            <ul className="space-y-4 text-left">
              {(t.raw("benefits.items") as string[]).map(
                (item: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-primary mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                )
              )}
            </ul>
            <Link
              href="/login"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-cta px-8 py-4 text-lg font-bold text-white hover:bg-cta-light transition-colors"
            >
              {t("cta")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

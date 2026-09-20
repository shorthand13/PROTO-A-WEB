import { auth } from "@clerk/nextjs/server";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { CheckCircle2 } from "lucide-react";
import { generatePageMetadata } from "@/lib/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Membership" });
  return generatePageMetadata({
    locale,
    title: t("title"),
    description: t("subtitle"),
    path: "/membership",
  });
}

export default async function MembershipPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { userId } = await auth();
  const t = await getTranslations("Membership");

  return (
    <div className="px-4 py-12 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">{t("title")}</h1>
        <p className="mt-3 text-base text-muted-foreground">{t("subtitle")}</p>

        <div className="mt-10 rounded-3xl bg-white border border-border p-8 text-left">
          <h2 className="text-lg font-bold text-foreground">{t("benefits.title")}</h2>
          <ul className="mt-4 flex flex-col gap-3">
            {(t.raw("benefits.items") as string[]).map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0 text-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <Link
          href={userId ? "/membership/videos" : "/login"}
          className="mt-8 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-primary-dark transition-colors"
        >
          {t("cta")}
        </Link>
      </div>
    </div>
  );
}

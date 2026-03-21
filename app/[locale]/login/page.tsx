import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import LoginButtons from "@/components/auth/LoginButtons";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <LoginContent />;
}

function LoginContent() {
  const t = useTranslations("Login");

  return (
    <div className="flex flex-1 items-center justify-center py-20 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">{t("title")}</h1>
          <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="rounded-2xl border border-border bg-background p-8 shadow-sm">
          <p className="text-sm text-muted-foreground text-center mb-6">
            {t("description")}
          </p>
          <LoginButtons />
        </div>
      </div>
    </div>
  );
}

import { SignIn } from "@clerk/nextjs";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Login" });
  return generatePageMetadata({
    locale,
    title: t("title"),
    description: t("description"),
    path: "/login",
  });
}

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex justify-center px-4 py-12 sm:py-20">
      <SignIn path={`/${locale}/login`} />
    </div>
  );
}

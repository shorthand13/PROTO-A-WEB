import { SignUp } from "@clerk/nextjs";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Register" });
  return generatePageMetadata({
    locale,
    title: t("title"),
    description: t("description"),
    path: "/register",
  });
}

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex justify-center px-4 py-12 sm:py-20">
      <SignUp path={`/${locale}/register`} />
    </div>
  );
}

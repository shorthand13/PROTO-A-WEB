import { setRequestLocale } from "next-intl/server";
import { SignUp } from "@clerk/nextjs";

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex flex-1 items-center justify-center py-20 px-4">
      <SignUp
        routing="hash"
        fallbackRedirectUrl={`/${locale}/onboarding`}
      />
    </div>
  );
}

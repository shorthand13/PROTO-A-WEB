import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { SignIn } from "@clerk/nextjs";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex flex-1 items-center justify-center py-20 px-4">
      <SignIn
        routing="hash"
        fallbackRedirectUrl={`/${locale}/membership`}
      />
    </div>
  );
}

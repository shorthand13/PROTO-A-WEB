import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import OnboardingForm from "@/components/onboarding/OnboardingForm";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function OnboardingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { userId } = await auth();
  if (!userId) redirect(`/${locale}/login`);

  return (
    <div className="flex flex-1 items-center justify-center py-20 px-4">
      <div className="w-full max-w-lg">
        <OnboardingForm />
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import SurveyForm from "@/components/survey/SurveyForm";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function SurveyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="py-16 px-4">
      <div className="mx-auto max-w-2xl">
        <SurveyForm />
      </div>
    </div>
  );
}

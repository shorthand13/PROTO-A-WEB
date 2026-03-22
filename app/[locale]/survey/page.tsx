import { setRequestLocale } from "next-intl/server";
import SurveyForm from "@/components/survey/SurveyForm";

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

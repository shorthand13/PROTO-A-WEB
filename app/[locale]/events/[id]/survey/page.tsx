import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getCMSEvent } from "@/lib/microcms";
import { notFound } from "next/navigation";
import EventSurveyContent from "./EventSurveyContent";

export const revalidate = 0;

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function EventSurveyPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const event = await getCMSEvent(id);
  if (!event) notFound();

  return <EventSurveyContent event={event} />;
}

import { setRequestLocale } from "next-intl/server";
import { getCMSEvent } from "@/lib/microcms";
import { notFound } from "next/navigation";
import EventDetailContent from "./EventDetailContent";

export const revalidate = 0;

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const event = await getCMSEvent(id);
  if (!event) notFound();

  const isPast = new Date(event.date) < new Date(new Date().toDateString());

  return <EventDetailContent event={event} locale={locale} isPast={isPast} />;
}

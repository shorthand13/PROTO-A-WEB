import { setRequestLocale } from "next-intl/server";
import { getCMSEvent } from "@/lib/microcms";
import { notFound } from "next/navigation";
import EventDetailContent from "./EventDetailContent";
import JsonLd from "@/components/seo/JsonLd";
import { eventJsonLd } from "@/lib/jsonld";

export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { id } = await params;
  const event = await getCMSEvent(id);
  if (!event) return {};
  return {
    title: event.title,
    description: event.description?.slice(0, 160) || event.title,
  };
}

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
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://proto-a.com";

  return (
    <>
      <JsonLd
        data={eventJsonLd({
          name: event.title,
          description: event.description?.slice(0, 160),
          startDate: event.date,
          location: event.location,
          url: `${baseUrl}/${locale}/events/${id}`,
        })}
      />
      <EventDetailContent event={event} locale={locale} isPast={isPast} />
    </>
  );
}

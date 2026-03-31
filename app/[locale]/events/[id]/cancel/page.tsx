import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getCMSEvent } from "@/lib/microcms";
import { notFound } from "next/navigation";
import { generateCancelToken } from "@/lib/actions/event-cancel";
import EventCancelContent from "./EventCancelContent";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function EventCancelPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ email?: string }>;
}) {
  const { locale, id } = await params;
  const { email } = await searchParams;
  setRequestLocale(locale);

  if (!email) return notFound();

  const event = await getCMSEvent(id);
  if (!event) return notFound();

  // Verify the token can be generated (email is valid for this event)
  const token = await generateCancelToken(email, id);

  return (
    <EventCancelContent
      event={event}
      email={email}
      token={token}
      locale={locale}
    />
  );
}

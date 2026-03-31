import Image from "next/image";
import { useTranslations } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getCMSEvents, type CMSEvent } from "@/lib/microcms";
import { Link } from "@/i18n/routing";
import { CalendarDays, MapPin } from "lucide-react";

export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Events" });
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function EventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { upcoming, past } = await getCMSEvents();

  return <EventsContent upcoming={upcoming} past={past} locale={locale} />;
}

function EventCard({
  event,
  isPast,
  locale,
}: {
  event: CMSEvent;
  isPast?: boolean;
  locale: string;
}) {
  const t = useTranslations("Events");
  const dateObj = new Date(event.date);
  const formattedDate = dateObj.toLocaleDateString(locale === "ja" ? "ja-JP" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });

  return (
    <div
      className={`rounded-2xl border border-border bg-background shadow-sm transition-shadow hover:shadow-md overflow-hidden ${
        isPast ? "opacity-70" : ""
      }`}
    >
      {event.image && (
        <div className="relative w-full aspect-[16/7]">
          <Image
            src={event.image.url}
            alt={event.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-5 sm:p-6">
      <div className="flex items-start gap-4">
        {/* Date badge */}
        <div className="hidden sm:flex flex-shrink-0 flex-col items-center justify-center rounded-xl bg-primary/10 px-3 py-2 min-w-[60px]">
          <span className="text-xs font-medium text-primary">
            {dateObj.toLocaleDateString(locale === "ja" ? "ja-JP" : "en-US", { month: "short" })}
          </span>
          <span className="text-2xl font-bold text-primary leading-tight">
            {dateObj.getDate()}
          </span>
          <span className="text-[10px] font-medium text-primary">
            {dateObj.toLocaleDateString(locale === "ja" ? "ja-JP" : "en-US", { weekday: "short" })}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-lg sm:text-lg font-bold text-foreground">
              {event.title}
            </h3>
            {isPast && (
              <span className="flex-shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                {t("ended")}
              </span>
            )}
          </div>

          {event.tags && event.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {event.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-2 space-y-1">
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <CalendarDays size={14} className="text-primary flex-shrink-0" />
              {formattedDate}
              {event.time ? ` ${event.time}` : ""}
            </p>
            {event.location && (
              <p className="flex items-start gap-1.5 text-sm text-muted-foreground">
                <MapPin size={14} className="text-primary flex-shrink-0 mt-0.5" />
                {event.location}
              </p>
            )}
          </div>

          {event.description && (
            <p className="mt-3 text-sm text-muted-foreground line-clamp-3">
              {event.description}
            </p>
          )}

          {!isPast && (
            <Link
              href={`/events/${event.id}` as "/events"}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-primary/90 transition-colors"
            >
              {t("details")}
            </Link>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}

function EventsContent({
  upcoming,
  past,
  locale,
}: {
  upcoming: CMSEvent[];
  past: CMSEvent[];
  locale: string;
}) {
  const t = useTranslations("Events");

  return (
    <div>
      {/* Page Header */}
      <section className="bg-background px-4 pt-8 pb-4 sm:pt-20 sm:pb-6 text-foreground">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h1 className="text-2xl sm:text-4xl font-bold">{t("title")}</h1>
          <p className="mt-1 sm:mt-4 text-sm sm:text-lg text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-4 sm:py-8 px-4">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4 sm:mb-6">
            {t("upcoming")}
          </h2>
          {upcoming.length > 0 ? (
            <div className="space-y-4">
              {upcoming.map((event) => (
                <EventCard key={event.id} event={event} locale={locale} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8 rounded-2xl border border-border bg-background">
              {t("noUpcoming")}
            </p>
          )}
        </div>
      </section>

      {/* Past Events */}
      {past.length > 0 && (
        <section className="py-4 sm:py-8 px-4 pb-12 sm:pb-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="text-lg sm:text-xl font-bold text-muted-foreground mb-4 sm:mb-6">
              {t("past")}
            </h2>
            <div className="space-y-3">
              {past.map((event) => (
                <EventCard key={event.id} event={event} isPast locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

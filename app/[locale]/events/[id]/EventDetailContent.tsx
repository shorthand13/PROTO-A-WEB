"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useActionState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { CalendarDays, MapPin, ArrowLeft, CheckCircle } from "lucide-react";
import { submitEventRegistration, type EventRegistrationState } from "@/lib/actions/event-registration";
import type { CMSEvent } from "@/lib/microcms";

const initialState: EventRegistrationState = { success: false, error: false };

export default function EventDetailContent({
  event,
  locale,
  isPast,
}: {
  event: CMSEvent;
  locale: string;
  isPast: boolean;
}) {
  const t = useTranslations("EventDetail");
  const [state, formAction, isPending] = useActionState(
    submitEventRegistration,
    initialState
  );

  const dateObj = new Date(event.date);
  const formattedDate = dateObj.toLocaleDateString(
    locale === "ja" ? "ja-JP" : "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    }
  );

  return (
    <div>
      {/* Header */}
      <section className="bg-background px-4 pt-8 pb-4 sm:pt-20 sm:pb-6 text-foreground">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft size={16} />
            {t("backToEvents")}
          </Link>

          {isPast && (
            <span className="inline-block rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground mb-3">
              {t("ended")}
            </span>
          )}

          <h1 className="text-2xl sm:text-4xl font-bold">{event.title}</h1>

          {event.image && (
            <div className="mt-6 relative w-full aspect-[16/7] rounded-2xl overflow-hidden">
              <Image
                src={event.image.url}
                alt={event.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="mt-4 space-y-2">
            <p className="flex items-center gap-2 text-base text-muted-foreground">
              <CalendarDays size={18} className="text-primary flex-shrink-0" />
              {formattedDate}
              {event.time ? ` ${event.time}` : ""}
            </p>
            {event.location && (
              <p className="flex items-start gap-2 text-base text-muted-foreground">
                <MapPin size={18} className="text-primary flex-shrink-0 mt-0.5" />
                {event.location}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="py-6 sm:py-10 px-4">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Description */}
            <div className="lg:col-span-3">
              {event.description && (
                <div className="rounded-2xl border border-border bg-background p-6 sm:p-8">
                  <h2 className="text-lg font-bold text-foreground mb-4">
                    {t("about")}
                  </h2>
                  <div
                    className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line"
                    dangerouslySetInnerHTML={{ __html: event.description }}
                  />
                </div>
              )}

              {/* Survey link for past events */}
              {isPast && (
                <div className="mt-6 rounded-2xl border border-border bg-primary/5 p-6 sm:p-8">
                  <h2 className="text-lg font-bold text-foreground mb-2">
                    {t("surveyTitle")}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t("surveyDescription")}
                  </p>
                  <Link
                    href={`/events/${event.id}/survey` as "/events"}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
                  >
                    {t("surveyButton")}
                  </Link>
                </div>
              )}
            </div>

            {/* Registration form */}
            <div className="lg:col-span-2">
              {!isPast ? (
                <div className="rounded-2xl border border-border bg-background p-6 shadow-sm sticky top-24">
                  <h2 className="text-lg font-bold text-foreground mb-4">
                    {t("registerTitle")}
                  </h2>

                  {state.success ? (
                    <div className="text-center py-6">
                      <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-3" />
                      <p className="text-base font-bold text-foreground">
                        {t("registerSuccess")}
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {t("registerSuccessDetail")}
                      </p>
                    </div>
                  ) : (
                    <form action={formAction} className="space-y-4">
                      <input type="hidden" name="eventId" value={event.id} />
                      <input type="hidden" name="eventTitle" value={event.title} />

                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                          {t("name")} <span className="text-accent">*</span>
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          placeholder={t("namePlaceholder")}
                          className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                          {t("email")} <span className="text-accent">*</span>
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          placeholder={t("emailPlaceholder")}
                          className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                        />
                      </div>

                      <div>
                        <label htmlFor="company" className="block text-sm font-medium text-foreground mb-1">
                          {t("company")}
                        </label>
                        <input
                          id="company"
                          name="company"
                          type="text"
                          placeholder={t("companyPlaceholder")}
                          className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                        />
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1">
                          {t("message")}
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={3}
                          placeholder={t("messagePlaceholder")}
                          className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
                        />
                      </div>

                      {state.error && (
                        <p className="text-sm text-red-500">{t("error")}</p>
                      )}

                      <button
                        type="submit"
                        disabled={isPending}
                        className="w-full rounded-xl bg-primary py-3 text-sm font-medium text-white hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isPending ? t("submitting") : t("register")}
                      </button>
                    </form>
                  )}
                </div>
              ) : (
                <div className="rounded-2xl border border-border bg-muted/50 p-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    {t("registrationClosed")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

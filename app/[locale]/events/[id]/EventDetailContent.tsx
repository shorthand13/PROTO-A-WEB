"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useActionState, useState } from "react";
import { Link } from "@/i18n/routing";
import { CalendarDays, MapPin, ArrowLeft, CheckCircle, Check, Users, Ticket, Monitor, ChevronRight } from "lucide-react";
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
  const [showMobileForm, setShowMobileForm] = useState(false);

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

          {event.tags && event.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
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
            {event.price && (
              <p className="flex items-center gap-2 text-base text-muted-foreground">
                <Ticket size={18} className="text-primary flex-shrink-0" />
                {t("price")}：{event.price}
              </p>
            )}
            {event.eventFormat && (
              <p className="flex items-center gap-2 text-base text-muted-foreground">
                <Monitor size={18} className="text-primary flex-shrink-0" />
                {event.eventFormat}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="py-6 sm:py-10 px-4">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              {/* Description */}
              {event.description && (
                <div className="mt-6 rounded-2xl border border-border bg-background p-6 sm:p-8">
                  <h2 className="text-lg font-bold text-foreground mb-4">
                    {t("about")}
                  </h2>
                  <div
                    className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line"
                    dangerouslySetInnerHTML={{ __html: event.description }}
                  />
                </div>
              )}

              {/* Target Audience */}
              {event.targetAudience && (
                <div className="mt-6 rounded-2xl border border-border bg-background p-6 sm:p-8">
                  <h2 className="flex items-center gap-2 text-lg font-bold text-foreground mb-4">
                    <Users size={20} className="text-primary" />
                    {t("targetAudience")}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {event.targetAudience}
                  </p>
                </div>
              )}

              {/* What you'll learn */}
              {event.learnings && (
                <div className="mt-6 rounded-2xl border border-border bg-background p-6 sm:p-8">
                  <h2 className="text-lg font-bold text-foreground mb-4">
                    {t("learnings")}
                  </h2>
                  <ul className="space-y-3">
                    {event.learnings.split("\n").filter(Boolean).map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <span className="flex-shrink-0 mt-0.5 rounded-full bg-primary/10 p-1">
                          <Check size={12} className="text-primary" />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements */}
              {event.requirements && (
                <div className="mt-6 rounded-2xl border border-border bg-background p-6 sm:p-8">
                  <h2 className="text-lg font-bold text-foreground mb-4">
                    {t("requirements")}
                  </h2>
                  <ul className="space-y-3">
                    {event.requirements.split("\n").filter(Boolean).map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <ChevronRight size={14} className="text-primary flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
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

            {/* Registration form - desktop only */}
            <div className="hidden lg:block lg:col-span-2">
              {!isPast ? (
                <div className="rounded-2xl border border-border bg-background p-6 shadow-sm sticky top-24">
                  <h2 className="text-lg font-bold text-foreground mb-4">
                    {t("registerTitle")}
                  </h2>

                  {state.success ? (
                    <div className="py-4">
                      <div className="text-center mb-4">
                        <CheckCircle className="mx-auto h-10 w-10 text-green-500 mb-2" />
                        <p className="text-base font-bold text-foreground">
                          {t("registerSuccess")}
                        </p>
                      </div>
                      <div className="rounded-xl bg-primary/5 p-4 space-y-2 text-sm">
                        <p className="text-muted-foreground">
                          <span className="font-medium text-foreground">{t("name")}:</span> {state.data?.name}
                        </p>
                        <p className="text-muted-foreground">
                          <span className="font-medium text-foreground">{t("email")}:</span> {state.data?.email}
                        </p>
                        <p className="text-muted-foreground">
                          <span className="font-medium text-foreground">{t("eventLabel")}:</span> {state.data?.eventTitle}
                        </p>
                      </div>
                      <p className="mt-3 text-xs text-muted-foreground text-center">
                        {t("confirmationEmailSent")}
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

      {/* Mobile: sticky register button */}
      {!isPast && !state.success && (
        <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-background p-3 lg:hidden">
          <button
            onClick={() => setShowMobileForm(true)}
            className="flex w-full items-center justify-center rounded-xl bg-primary py-3 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
          >
            {t("register")}
          </button>
        </div>
      )}

      {/* Mobile: bottom sheet registration form */}
      {!isPast && showMobileForm && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 transition-opacity"
            onClick={() => setShowMobileForm(false)}
          />
          {/* Sheet */}
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-background p-6 shadow-xl animate-in slide-in-from-bottom duration-300">
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-muted" />
            <h2 className="text-lg font-bold text-foreground mb-4">
              {t("registerTitle")}
            </h2>

            {state.success ? (
              <div className="py-4">
                <div className="text-center mb-4">
                  <CheckCircle className="mx-auto h-10 w-10 text-green-500 mb-2" />
                  <p className="text-base font-bold text-foreground">
                    {t("registerSuccess")}
                  </p>
                </div>
                <div className="rounded-xl bg-primary/5 p-4 space-y-2 text-sm">
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">{t("name")}:</span> {state.data?.name}
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">{t("email")}:</span> {state.data?.email}
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">{t("eventLabel")}:</span> {state.data?.eventTitle}
                  </p>
                </div>
                <p className="mt-3 text-xs text-muted-foreground text-center">
                  {t("confirmationEmailSent")}
                </p>
                <button
                  onClick={() => setShowMobileForm(false)}
                  className="mt-4 w-full text-sm text-primary font-medium"
                >
                  {t("close")}
                </button>
              </div>
            ) : (
              <form action={formAction} className="space-y-4">
                <input type="hidden" name="eventId" value={event.id} />
                <input type="hidden" name="eventTitle" value={event.title} />

                <div>
                  <label htmlFor="mobile-name" className="block text-sm font-medium text-foreground mb-1">
                    {t("name")} <span className="text-accent">*</span>
                  </label>
                  <input
                    id="mobile-name"
                    name="name"
                    type="text"
                    required
                    placeholder={t("namePlaceholder")}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="mobile-email" className="block text-sm font-medium text-foreground mb-1">
                    {t("email")} <span className="text-accent">*</span>
                  </label>
                  <input
                    id="mobile-email"
                    name="email"
                    type="email"
                    required
                    placeholder={t("emailPlaceholder")}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="mobile-company" className="block text-sm font-medium text-foreground mb-1">
                    {t("company")}
                  </label>
                  <input
                    id="mobile-company"
                    name="company"
                    type="text"
                    placeholder={t("companyPlaceholder")}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="mobile-message" className="block text-sm font-medium text-foreground mb-1">
                    {t("message")}
                  </label>
                  <textarea
                    id="mobile-message"
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
        </div>
      )}
    </div>
  );
}

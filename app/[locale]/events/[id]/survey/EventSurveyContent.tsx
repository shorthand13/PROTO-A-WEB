"use client";

import { useTranslations } from "next-intl";
import { useActionState, useState } from "react";
import { Link } from "@/i18n/routing";
import { ArrowLeft, CheckCircle, Star } from "lucide-react";
import { submitEventSurvey, type EventSurveyState } from "@/lib/actions/event-survey";
import type { CMSEvent } from "@/lib/microcms";

const initialState: EventSurveyState = { success: false, error: false };

export default function EventSurveyContent({ event }: { event: CMSEvent }) {
  const t = useTranslations("EventSurvey");
  const [state, formAction, isPending] = useActionState(
    submitEventSurvey,
    initialState
  );
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div>
      <section className="bg-background px-4 pt-8 pb-4 sm:pt-20 sm:pb-6 text-foreground">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <Link
            href={`/events/${event.id}` as "/events"}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft size={16} />
            {t("backToEvent")}
          </Link>

          <h1 className="text-2xl sm:text-3xl font-bold">{t("title")}</h1>
          <p className="mt-2 text-base text-muted-foreground">{event.title}</p>
        </div>
      </section>

      <section className="py-6 sm:py-10 px-4 pb-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <div className="rounded-2xl border border-border bg-background p-6 sm:p-8 shadow-sm">
            {state.success ? (
              <div className="text-center py-8">
                <CheckCircle className="mx-auto h-14 w-14 text-green-500 mb-4" />
                <p className="text-xl font-bold text-foreground">
                  {t("thankYou")}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t("thankYouDetail")}
                </p>
                <Link
                  href="/events"
                  className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
                >
                  {t("backToEvents")}
                </Link>
              </div>
            ) : (
              <form action={formAction} className="space-y-6">
                <input type="hidden" name="eventId" value={event.id} />
                <input type="hidden" name="eventTitle" value={event.title} />
                <input type="hidden" name="rating" value={rating} />

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t("ratingLabel")} <span className="text-accent">*</span>
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setRating(value)}
                        onMouseEnter={() => setHoverRating(value)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 transition-transform hover:scale-110"
                      >
                        <Star
                          size={32}
                          className={
                            value <= (hoverRating || rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-border"
                          }
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* What was helpful */}
                <div>
                  <label htmlFor="helpful" className="block text-sm font-medium text-foreground mb-1">
                    {t("helpfulLabel")}
                  </label>
                  <textarea
                    id="helpful"
                    name="helpful"
                    rows={4}
                    placeholder={t("helpfulPlaceholder")}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
                  />
                </div>

                {/* Suggestions */}
                <div>
                  <label htmlFor="suggestions" className="block text-sm font-medium text-foreground mb-1">
                    {t("suggestionsLabel")}
                  </label>
                  <textarea
                    id="suggestions"
                    name="suggestions"
                    rows={4}
                    placeholder={t("suggestionsPlaceholder")}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
                  />
                </div>

                {state.error && (
                  <p className="text-sm text-red-500">{t("error")}</p>
                )}

                <button
                  type="submit"
                  disabled={isPending || rating === 0}
                  className="w-full rounded-xl bg-primary py-3 text-sm font-medium text-white hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? t("submitting") : t("submit")}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

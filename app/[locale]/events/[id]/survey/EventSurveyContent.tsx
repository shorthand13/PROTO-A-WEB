"use client";

import { useTranslations } from "next-intl";
import { useActionState, useState } from "react";
import { Link } from "@/i18n/routing";
import { ArrowLeft, CheckCircle, Star } from "lucide-react";
import { submitEventSurvey, type EventSurveyState } from "@/lib/actions/event-survey";
import type { CMSEvent } from "@/lib/microcms";

const initialState: EventSurveyState = { success: false, error: false };

function StarRating({
  name,
  label,
  value,
  onChange,
}: {
  name: string;
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">
        {label} <span className="text-accent">*</span>
      </label>
      <input type="hidden" name={name} value={value} />
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            onMouseEnter={() => setHover(v)}
            onMouseLeave={() => setHover(0)}
            className="p-1 transition-transform hover:scale-110"
          >
            <Star
              size={32}
              className={
                v <= (hover || value)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-border"
              }
            />
          </button>
        ))}
      </div>
    </div>
  );
}

const SERVICE_OPTIONS = [
  "itIntroduction",
  "itSupport",
  "workshop",
  "dxTraining",
  "none",
] as const;

export default function EventSurveyContent({ event }: { event: CMSEvent }) {
  const t = useTranslations("EventSurvey");
  const [state, formAction, isPending] = useActionState(
    submitEventSurvey,
    initialState
  );
  const [rating, setRating] = useState(0);
  const [instructorRating, setInstructorRating] = useState(0);
  const [wouldRefer, setWouldRefer] = useState<string>("");

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

                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                    {t("nameLabel")} <span className="text-accent">*</span>
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

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                    {t("emailLabel")} <span className="text-accent">*</span>
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

                {/* Overall Rating */}
                <StarRating
                  name="rating"
                  label={t("ratingLabel")}
                  value={rating}
                  onChange={setRating}
                />

                {/* Instructor Rating */}
                <StarRating
                  name="instructorRating"
                  label={t("instructorRatingLabel")}
                  value={instructorRating}
                  onChange={setInstructorRating}
                />

                {/* Would refer */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t("referLabel")}
                  </label>
                  <div className="flex gap-3">
                    {(["yes", "no"] as const).map((option) => (
                      <label
                        key={option}
                        className={`flex-1 flex items-center justify-center rounded-xl border px-4 py-2.5 text-sm font-medium cursor-pointer transition-colors ${
                          wouldRefer === option
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="wouldRefer"
                          value={option}
                          checked={wouldRefer === option}
                          onChange={(e) => setWouldRefer(e.target.value)}
                          className="sr-only"
                        />
                        {t(`referOption_${option}`)}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Referral reason (conditional) */}
                {wouldRefer === "yes" && (
                  <div>
                    <label htmlFor="referReason" className="block text-sm font-medium text-foreground mb-1">
                      {t("referReasonLabel")}
                    </label>
                    <textarea
                      id="referReason"
                      name="referReason"
                      rows={3}
                      placeholder={t("referReasonPlaceholder")}
                      className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
                    />
                  </div>
                )}

                {/* General feedback */}
                <div>
                  <label htmlFor="feedback" className="block text-sm font-medium text-foreground mb-1">
                    {t("feedbackLabel")}
                  </label>
                  <textarea
                    id="feedback"
                    name="feedback"
                    rows={4}
                    placeholder={t("feedbackPlaceholder")}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
                  />
                </div>

                {/* Improvement suggestions */}
                <div>
                  <label htmlFor="improvements" className="block text-sm font-medium text-foreground mb-1">
                    {t("improvementsLabel")}
                  </label>
                  <p className="text-xs text-muted-foreground mb-2">{t("improvementsHint")}</p>
                  <textarea
                    id="improvements"
                    name="improvements"
                    rows={4}
                    placeholder={t("improvementsPlaceholder")}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
                  />
                </div>

                {/* Service interest */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t("serviceInterestLabel")}
                  </label>
                  <div className="space-y-2">
                    {SERVICE_OPTIONS.map((key) => (
                      <label
                        key={key}
                        className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 text-sm cursor-pointer hover:border-primary/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                      >
                        <input
                          type="checkbox"
                          name="serviceInterest"
                          value={key}
                          className="rounded border-border text-primary focus:ring-primary"
                        />
                        <span className="text-foreground">{t(`service_${key}`)}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Want service info */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t("wantInfoLabel")}
                  </label>
                  <div className="space-y-2">
                    {(["yes", "no"] as const).map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 text-sm cursor-pointer hover:border-primary/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                      >
                        <input
                          type="radio"
                          name="wantInfo"
                          value={option}
                          className="border-border text-primary focus:ring-primary"
                        />
                        <span className="text-foreground">{t(`wantInfo_${option}`)}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Free consultation */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    {t("consultationLabel")}
                  </label>
                  <p className="text-xs text-muted-foreground mb-2">{t("consultationHint")}</p>
                  <div className="space-y-2">
                    {(["yes", "considering", "no"] as const).map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 text-sm cursor-pointer hover:border-primary/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                      >
                        <input
                          type="radio"
                          name="consultation"
                          value={option}
                          className="border-border text-primary focus:ring-primary"
                        />
                        <span className="text-foreground">{t(`consultation_${option}`)}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {state.error && (
                  <p className="text-sm text-red-500">{t("error")}</p>
                )}

                <button
                  type="submit"
                  disabled={isPending || rating === 0 || instructorRating === 0}
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

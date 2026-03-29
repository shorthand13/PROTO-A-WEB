"use client";

import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { Link } from "@/i18n/routing";
import { CalendarDays, MapPin, ArrowLeft, CheckCircle, AlertTriangle } from "lucide-react";
import { submitEventCancel, type EventCancelState } from "@/lib/actions/event-cancel";
import type { CMSEvent } from "@/lib/microcms";

const initialState: EventCancelState = { success: false, error: false };

export default function EventCancelContent({
  event,
  email,
  token,
  locale,
}: {
  event: CMSEvent;
  email: string;
  token: string;
  locale: string;
}) {
  const t = useTranslations("EventCancel");
  const [state, formAction, isPending] = useActionState(
    submitEventCancel,
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
      <section className="bg-background px-4 pt-8 pb-4 sm:pt-20 sm:pb-6 text-foreground">
        <div className="mx-auto max-w-xl px-4 sm:px-6">
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft size={16} />
            {t("backToEvents")}
          </Link>

          {state.success ? (
            <div className="rounded-2xl border border-border bg-background p-6 sm:p-8 text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-3" />
              <h1 className="text-xl font-bold text-foreground mb-2">
                {t("cancelledTitle")}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t("cancelledDetail")}
              </p>
              <Link
                href="/events"
                className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
              >
                {t("backToEvents")}
              </Link>
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-background p-6 sm:p-8">
              <div className="text-center mb-6">
                <AlertTriangle className="mx-auto h-10 w-10 text-amber-500 mb-3" />
                <h1 className="text-xl font-bold text-foreground">
                  {t("title")}
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t("description")}
                </p>
              </div>

              <div className="rounded-xl bg-primary/5 p-4 space-y-2 mb-6">
                <p className="font-bold text-foreground">{event.title}</p>
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays size={14} className="text-primary flex-shrink-0" />
                  {formattedDate}
                  {event.time ? ` ${event.time}` : ""}
                </p>
                {event.location && (
                  <p className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin size={14} className="text-primary flex-shrink-0 mt-0.5" />
                    {event.location}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  {t("email")}: {email}
                </p>
              </div>

              {state.error && (
                <p className="text-sm text-red-500 mb-4">{t("error")}</p>
              )}

              <form action={formAction} className="space-y-3">
                <input type="hidden" name="eventId" value={event.id} />
                <input type="hidden" name="eventTitle" value={event.title} />
                <input type="hidden" name="email" value={email} />
                <input type="hidden" name="token" value={token} />

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full rounded-xl bg-red-500 py-3 text-sm font-medium text-white hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? t("cancelling") : t("confirmCancel")}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

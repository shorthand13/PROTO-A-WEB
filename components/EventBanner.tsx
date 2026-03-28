"use client";

import { useState, useEffect } from "react";
import { CalendarDays, MapPin, X } from "lucide-react";

type EventData = {
  title: string;
  date: string;
  time?: string;
  location?: string;
  registrationUrl?: string;
};

export default function EventBanner({ event }: { event: EventData | null }) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!event) return;
    const wasDismissed = sessionStorage.getItem("event-banner-dismissed");
    if (wasDismissed === event.date) {
      setDismissed(true);
      return;
    }

    const timer = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(timer);
  }, [event]);

  function handleDismiss() {
    if (event) sessionStorage.setItem("event-banner-dismissed", event.date);
    setVisible(false);
    setDismissed(true);
  }

  function handleReopen() {
    setDismissed(false);
    setVisible(true);
    if (event) sessionStorage.removeItem("event-banner-dismissed");
  }

  if (!event) return null;

  // Show collapsed icon after dismissal
  if (dismissed && !visible) {
    return (
      <button
        onClick={handleReopen}
        className="fixed bottom-44 sm:bottom-24 right-4 sm:right-6 z-40 rounded-full bg-gradient-to-br from-[#eaad63] to-[#d4922e] p-3 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
        aria-label="イベント情報を表示"
      >
        <CalendarDays size={20} className="text-white" />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
        </span>
      </button>
    );
  }

  if (!visible) return null;

  const dateObj = new Date(event.date);
  const formattedDate = dateObj.toLocaleDateString("ja-JP", {
    month: "numeric",
    day: "numeric",
    weekday: "short",
  });

  return (
    <div className="fixed bottom-44 sm:bottom-24 right-4 sm:right-6 z-40 max-w-[280px] sm:max-w-xs animate-in slide-in-from-right">
      <div className="rounded-2xl bg-gradient-to-r from-[#eaad63] via-[#e8c77b] to-[#eaad63] p-[2px] shadow-xl">
        <div className="rounded-2xl bg-white p-4">
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>

          <div className="flex items-start gap-3">
            <div className="relative flex-shrink-0 rounded-xl bg-[#eaad63]/15 p-2.5">
              <CalendarDays size={22} className="text-[#eaad63]" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#eaad63] opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#eaad63]" />
              </span>
            </div>
            <div className="pr-4">
              <p className="text-sm font-bold text-foreground">{event.title}</p>
              <div className="mt-3 space-y-2">
                <p className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                  <CalendarDays size={13} className="text-[#eaad63]" />
                  {formattedDate}
                  {event.time ? ` ${event.time}` : ""}
                </p>
                {event.location && (
                  <p className="flex items-start gap-1.5 text-xs font-medium text-foreground">
                    <MapPin size={13} className="text-[#eaad63] flex-shrink-0 mt-0.5" />
                    {event.location}
                  </p>
                )}
              </div>
            </div>
          </div>

          {event.registrationUrl && (
            <a
              href={event.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleDismiss}
              className="mt-3 flex w-full items-center justify-center rounded-xl bg-[#eaad63] py-2.5 text-sm font-medium text-white hover:bg-[#d9993a] transition-colors"
            >
              申し込む
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

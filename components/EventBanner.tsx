"use client";

import { useState, useEffect } from "react";
import { CalendarDays, X } from "lucide-react";

type EventData = {
  title: string;
  date: string;
  time?: string;
  location?: string;
  registrationUrl?: string;
};

export default function EventBanner({ event }: { event: EventData | null }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!event) return;
    const dismissed = sessionStorage.getItem("event-banner-dismissed");
    if (dismissed === event.date) return;

    const timer = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(timer);
  }, [event]);

  function handleDismiss() {
    if (event) sessionStorage.setItem("event-banner-dismissed", event.date);
    setVisible(false);
  }

  if (!event || !visible) return null;

  const dateObj = new Date(event.date);
  const formattedDate = dateObj.toLocaleDateString("ja-JP", {
    month: "numeric",
    day: "numeric",
    weekday: "short",
  });

  return (
    <div className="fixed bottom-44 sm:bottom-24 right-4 sm:right-6 z-40 max-w-[280px] sm:max-w-xs animate-in slide-in-from-right">
      <div className="rounded-2xl border border-[#eaad63]/30 bg-white p-4 shadow-lg">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 rounded-xl bg-[#eaad63]/15 p-2.5">
            <CalendarDays size={22} className="text-[#eaad63]" />
          </div>
          <div className="pr-4">
            <p className="text-sm font-bold text-foreground">{event.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {formattedDate}
              {event.time ? ` ${event.time}` : ""}
            </p>
            {event.location && (
              <p className="text-xs text-muted-foreground">{event.location}</p>
            )}
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
  );
}

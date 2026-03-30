"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { CalendarDays, MapPin, X, ArrowRight } from "lucide-react";

type EventData = {
  id: string;
  title: string;
  date: string;
  time?: string;
  location?: string;
  image?: { url: string; width?: number; height?: number };
  tags?: string[];
  price?: string;
};

export default function EventPopup({ event }: { event: EventData | null }) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!event) return;

    const dismissed = sessionStorage.getItem("event-popup-dismissed");
    if (dismissed) return;

    // Don't show on event detail pages — user is already looking at events
    if (pathname.includes("/events/")) return;

    const timer = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(timer);
  }, [event, pathname]);

  if (!event || !visible) return null;

  function handleDismiss() {
    sessionStorage.setItem("event-popup-dismissed", "1");
    setVisible(false);
  }

  const dateObj = new Date(event.date);
  const formattedDate = dateObj.toLocaleDateString("ja-JP", {
    month: "long",
    day: "numeric",
    weekday: "short",
  });

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40 animate-in fade-in duration-300"
        onClick={handleDismiss}
      />

      {/* Popup */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden pointer-events-auto animate-in zoom-in-95 fade-in duration-300">
          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 z-10 rounded-full bg-white/80 backdrop-blur-sm p-1.5 text-muted-foreground hover:bg-white hover:text-foreground transition-colors shadow-sm"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          {/* Event image */}
          {event.image ? (
            <div className="relative w-full aspect-[16/9]">
              <Image
                src={event.image.url}
                alt={event.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          ) : (
            <div className="w-full aspect-[16/9] bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <CalendarDays size={32} className="text-primary/40" />
            </div>
          )}

          {/* Content */}
          <div className="p-5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              開催予定イベント
            </span>

            <h3 className="mt-3 text-lg font-bold text-foreground leading-snug">
              {event.title}
            </h3>

            {event.tags && event.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {event.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-3 space-y-1">
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <CalendarDays size={14} className="text-primary flex-shrink-0" />
                {formattedDate}
                {event.time ? ` ${event.time}` : ""}
              </p>
              {event.location && (
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin size={14} className="text-primary flex-shrink-0" />
                  {event.location}
                </p>
              )}
              {event.price && (
                <p className="text-sm font-medium text-primary">{event.price}</p>
              )}
            </div>

            <Link
              href={`/events/${event.id}` as "/events"}
              onClick={handleDismiss}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-white hover:bg-primary/90 transition-colors"
            >
              詳細を見る
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

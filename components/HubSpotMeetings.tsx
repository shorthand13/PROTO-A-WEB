"use client";

import { useEffect } from "react";
import Script from "next/script";

export default function HubSpotMeetings({ src }: { src: string }) {
  useEffect(() => {
    // Re-run HubSpot embed script if it was already loaded (e.g. on client-side navigation)
    const w = window as unknown as { hbspt?: unknown };
    if (w.hbspt) {
      const existing = document.querySelector(
        'script[src="https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js"]',
      );
      if (existing) {
        existing.remove();
        const s = document.createElement("script");
        s.src = "https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js";
        s.async = true;
        document.body.appendChild(s);
      }
    }
  }, []);

  return (
    <>
      <div
        className="meetings-iframe-container"
        data-src={`${src}?embed=true`}
      />
      <Script
        src="https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js"
        strategy="lazyOnload"
      />
    </>
  );
}

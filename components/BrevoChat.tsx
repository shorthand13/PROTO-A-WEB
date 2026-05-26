"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    BrevoConversationsID?: string;
    BrevoConversations?: ((...args: unknown[]) => void) & { q?: unknown[] };
  }
}

export default function BrevoChat() {
  useEffect(() => {
    window.BrevoConversationsID = "69d62bbf2149c5664b099b29";
    window.BrevoConversations =
      window.BrevoConversations ||
      function (...args: unknown[]) {
        (window.BrevoConversations!.q = window.BrevoConversations!.q || []).push(args);
      };
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://conversations-widget.brevo.com/brevo-conversations.js";
    document.head.appendChild(s);
    return () => {
      s.remove();
    };
  }, []);

  return null;
}

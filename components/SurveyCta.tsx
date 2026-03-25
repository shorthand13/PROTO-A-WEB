"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/routing";
import { ClipboardList, X } from "lucide-react";

export default function SurveyCta() {
  const t = useTranslations("Survey");
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("survey-cta-dismissed");
    if (dismissed) return;

    const isHome = pathname === "/" || /^\/[a-z]{2}\/?$/.test(pathname);

    if (isHome) {
      // On homepage: delay enough for animation to finish (or show quickly if already seen)
      const alreadySeen = sessionStorage.getItem("hero-animation-seen") === "true";
      const delay = alreadySeen ? 500 : 8000;
      const timer = setTimeout(() => setVisible(true), delay);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  function handleDismiss() {
    sessionStorage.setItem("survey-cta-dismissed", "1");
    setVisible(false);
  }

  // Hide on the survey page itself
  if (pathname.includes("/survey")) return null;
  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40 max-w-xs animate-in slide-in-from-left">
      <div className="rounded-2xl border border-primary/20 bg-white p-4 shadow-lg">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 rounded-xl bg-primary/10 p-2.5">
            <ClipboardList size={22} className="text-primary" />
          </div>
          <div className="pr-4">
            <p className="text-sm font-bold text-foreground">{t("homeTitle")}</p>
            <p className="mt-1 text-xs text-muted-foreground">{t("time")}</p>
          </div>
        </div>

        <Link
          href="/survey"
          onClick={handleDismiss}
          className="mt-3 flex w-full items-center justify-center rounded-xl bg-primary py-2.5 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
        >
          {t("homeCta")}
        </Link>
      </div>
    </div>
  );
}

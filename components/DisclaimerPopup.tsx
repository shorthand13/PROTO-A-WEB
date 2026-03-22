"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";

export default function DisclaimerPopup() {
  const t = useTranslations("Disclaimer");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("disclaimer-dismissed");
    if (!dismissed) {
      setVisible(true);
    }
  }, []);

  function handleDismiss() {
    localStorage.setItem("disclaimer-dismissed", "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleDismiss}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="mb-4 text-center">
          <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
            {t("badge")}
          </span>
        </div>

        <h2 className="mb-3 text-center text-lg font-bold text-foreground">
          {t("title")}
        </h2>

        <ul className="mb-6 space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-amber-500">&#9888;</span>
            {t("unstable")}
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-amber-500">&#9888;</span>
            {t("wip")}
          </li>
        </ul>

        <button
          onClick={handleDismiss}
          className="w-full rounded-xl bg-primary py-2.5 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
        >
          {t("accept")}
        </button>
      </div>
    </div>
  );
}

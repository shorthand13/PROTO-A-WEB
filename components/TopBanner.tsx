"use client";

import { useTranslations } from "next-intl";

export default function TopBanner() {
  const t = useTranslations("Banner");

  return (
    <div className="bg-amber-500 text-white text-center text-sm py-2 px-4">
      <p>{t("message")}</p>
    </div>
  );
}

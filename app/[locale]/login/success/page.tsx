"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { CheckCircle } from "lucide-react";
import { useEffect } from "react";

export default function LoginSuccessPage() {
  const t = useTranslations("LoginSuccess");
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/membership");
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-1 items-center justify-center py-20 px-4">
      <div className="w-full max-w-md text-center">
        <div className="rounded-2xl border border-border bg-background p-8 shadow-sm">
          <CheckCircle className="mx-auto h-16 w-16 text-primary mb-6" />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {t("title")}
          </h1>
          <p className="text-muted-foreground mb-6">{t("subtitle")}</p>
          <p className="text-sm text-muted-foreground">{t("redirecting")}</p>
          <button
            onClick={() => router.push("/membership")}
            className="mt-6 inline-flex items-center justify-center rounded-full bg-cta px-8 py-3 text-base font-bold text-white hover:bg-cta-light transition-colors"
          >
            {t("cta")}
          </button>
        </div>
      </div>
    </div>
  );
}

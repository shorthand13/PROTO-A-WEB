"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "@/i18n/routing";

export default function ScrollToTop() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    if (window.location.hash) return;
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

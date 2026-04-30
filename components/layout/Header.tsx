"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { Menu, X, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import LogoLink from "./LogoLink";

const navItems = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "services", href: "/services" },
  { key: "caseStudies", href: "/case-studies" },
  { key: "blog", href: "/blog" },
  { key: "events", href: "/events" },
  { key: "contact", href: "/contact" },
] as const;

export default function Header({ newItems = [] }: { newItems?: string[] }) {
  const t = useTranslations("Navigation");
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header className="relative z-50 border-b border-border bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <LogoLink priority className={pathname === "/" ? "md:invisible" : ""} />

            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-muted"
                aria-label="Toggle menu"
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-black/30" onClick={() => setMenuOpen(false)} />
      )}

      {/* Dropdown menu */}
      <div
        className={`absolute left-0 right-0 z-50 overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{ top: "65px" }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="rounded-2xl bg-white shadow-lg border-3 border-primary p-4 sm:p-6">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`rounded-lg px-4 py-3 text-base font-medium transition-colors flex items-center gap-2 ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <span className="flex-shrink-0 h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                      <ChevronRight size={11} className="text-white" />
                    </span>
                    {t(item.key)}
                    {newItems.includes(item.key) && (
                      <span className="rounded-full bg-[#c0392b] px-2 py-0.5 text-[10px] font-bold text-white leading-none uppercase tracking-wide animate-[scale-pulse_2s_ease-in-out_infinite]">
                        New
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}

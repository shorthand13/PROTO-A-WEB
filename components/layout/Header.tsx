"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import LanguageSwitcher from "./LanguageSwitcher";
import LogoLink from "./LogoLink";

const navItems = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "services", href: "/services" },
  { key: "blog", href: "/blog" },
  { key: "caseStudies", href: "/case-studies" },
  { key: "contact", href: "/contact" },
] as const;

export default function Header() {
  const t = useTranslations("Navigation");
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isSignedIn } = useUser();
  const { signOut } = useClerk();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <LogoLink priority />

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {t(item.key)}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            {isSignedIn ? (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/membership"
                  className="inline-flex items-center justify-center rounded-full bg-cta px-4 py-2 text-sm font-bold text-white hover:bg-cta-light transition-colors"
                >
                  {t("membership")}
                </Link>
                <button
                  onClick={() => signOut({ redirectUrl: "/" })}
                  className="inline-flex items-center justify-center rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  {t("logout")}
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  {t("login")}
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
                >
                  {t("register")}
                </Link>
              </div>
            )}
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-muted"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="flex flex-col px-4 py-4 gap-1">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {t(item.key)}
                </Link>
              );
            })}
            {isSignedIn ? (
              <>
                <Link
                  href="/membership"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 rounded-full bg-cta px-4 py-3 text-center text-base font-bold text-white hover:bg-cta-light transition-colors"
                >
                  {t("membership")}
                </Link>
                <button
                  onClick={() => { setMobileOpen(false); signOut({ redirectUrl: "/" }); }}
                  className="mt-2 rounded-full border border-border px-4 py-3 text-center text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  {t("logout")}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 rounded-full border border-border px-4 py-3 text-center text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  {t("login")}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="mt-1 rounded-full bg-primary px-4 py-3 text-center text-base font-medium text-white hover:bg-primary-dark transition-colors"
                >
                  {t("register")}
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

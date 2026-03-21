import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function Footer() {
  const t = useTranslations("Footer");
  const tNav = useTranslations("Navigation");

  return (
    <footer className="border-t border-border bg-muted">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="text-xl font-bold text-primary">
              Proto-A
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              {t("description")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-foreground">{t("quickLinks")}</h3>
            <nav className="mt-3 flex flex-col gap-2">
              <Link
                href="/about"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {tNav("about")}
              </Link>
              <Link
                href="/services"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {tNav("services")}
              </Link>
              <Link
                href="/blog"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {tNav("blog")}
              </Link>
              <Link
                href="/contact"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {tNav("contact")}
              </Link>
            </nav>
          </div>

          {/* Social / LINE */}
          <div>
            <h3 className="font-bold text-foreground">{t("followUs")}</h3>
            <div className="mt-3 flex flex-col gap-2">
              <p className="text-sm font-medium text-foreground">
                {t("lineOfficial")}
              </p>
              <div className="h-24 w-24 rounded-lg bg-muted-foreground/10 flex items-center justify-center text-xs text-muted-foreground">
                LINE QR
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">{t("copyright")}</p>
        </div>
      </div>
    </footer>
  );
}

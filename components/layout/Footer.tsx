import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  INSTAGRAM_QR_IMAGE_SRC,
  INSTAGRAM_URL,
  LINE_ADD_FRIEND_URL,
  LINE_QR_IMAGE_SRC,
} from "@/lib/social-links";
import LogoLink from "./LogoLink";

export default function Footer() {
  const t = useTranslations("Footer");
  const tNav = useTranslations("Navigation");

  return (
    <footer className="border-t border-border bg-muted">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <LogoLink />
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
                href="/contact"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {tNav("contact")}
              </Link>
            </nav>
          </div>

          {/* Social / LINE & Instagram */}
          <div>
            <h3 className="font-bold text-foreground">{t("followUs")}</h3>
            <div className="mt-3 flex flex-wrap gap-8 sm:gap-10">
              <div className="flex flex-col gap-2">
                <a
                  href={LINE_ADD_FRIEND_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  {t("lineOfficial")}
                </a>
                <a
                  href={LINE_ADD_FRIEND_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-fit rounded-lg border border-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <Image
                    src={LINE_QR_IMAGE_SRC}
                    alt={t("lineQrAlt")}
                    width={120}
                    height={120}
                    unoptimized
                    className="h-[120px] w-[120px] rounded-lg border border-border bg-white object-contain shadow-sm transition hover:opacity-90"
                  />
                </a>
              </div>
              <div className="flex flex-col gap-2">
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  {t("instagram")}
                </a>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-fit rounded-lg border border-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <Image
                    src={INSTAGRAM_QR_IMAGE_SRC}
                    alt={t("instagramQrAlt")}
                    width={120}
                    height={120}
                    className="h-[120px] w-[120px] rounded-lg border border-border bg-white object-contain shadow-sm transition hover:opacity-90"
                  />
                </a>
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

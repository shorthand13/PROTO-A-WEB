import type { MetadataRoute } from "next";
import { getCaseStudies } from "@/lib/case-studies";
import { getCMSEvents } from "@/lib/microcms";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://proto-a.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locales = ["ja", "en"];
  const staticPages = [
    "",
    "/about",
    "/services",
    "/case-studies",
    "/contact",
    "/events",
  ];

  const entries: MetadataRoute.Sitemap = [];

  // Static pages
  for (const locale of locales) {
    for (const page of staticPages) {
      entries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === "" ? "weekly" : "monthly",
        priority: page === "" ? 1 : 0.8,
      });
    }
  }

  // Case studies
  for (const locale of locales) {
    const studies = getCaseStudies(locale);
    for (const study of studies) {
      entries.push({
        url: `${baseUrl}/${locale}/case-studies/${study.slug}`,
        lastModified: new Date(study.frontmatter.date),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  // Events
  const { upcoming, past } = await getCMSEvents();
  const allEvents = [...upcoming, ...past];
  for (const event of allEvents) {
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}/events/${event.id}`,
        lastModified: new Date(event.date),
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
  }

  return entries;
}

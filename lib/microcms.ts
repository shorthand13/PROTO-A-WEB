import { createClient } from "microcms-js-sdk";
import type { MicroCMSListContent, MicroCMSImage } from "microcms-js-sdk";
import type {
  BlogPost,
  CaseStudy as CaseStudyLocal,
} from "@/lib/types";

// microCMS event type
export type CMSEvent = {
  title: string;
  date: string;
  time?: string;
  location?: string;
  description?: string;
  registrationUrl?: string;
  image?: MicroCMSImage;
} & MicroCMSListContent;

export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN!,
  apiKey: process.env.MICROCMS_API_KEY!,
});

// microCMS blog type
type CMSBlog = {
  title: string;
  content: string;
  excerpt: string;
  coverImage?: MicroCMSImage;
  author: string;
  tags?: string[];
  locale: string | string[];
} & MicroCMSListContent;

// microCMS case study type
type CMSCaseStudy = {
  title: string;
  slug?: string;
  industry: string;
  tags?: string[];
  challenge: string;
  solution: string;
  result: string;
  testimonial?: string;
  thumbnail?: MicroCMSImage;
  locale: string | string[];
} & MicroCMSListContent;

// Normalize locale value (handles both string and array from microCMS)
function getLocale(locale: string | string[]): string {
  const val = Array.isArray(locale) ? locale[0] : locale;
  return val === "jp" ? "ja" : val;
}

// Convert microCMS blog to local BlogPost format
function toBlogPost(cms: CMSBlog): BlogPost {
  return {
    slug: cms.id,
    frontmatter: {
      title: cms.title,
      date: cms.publishedAt?.split("T")[0] ?? cms.createdAt.split("T")[0],
      author: cms.author,
      tags: cms.tags ?? [],
      locale: getLocale(cms.locale),
      excerpt: cms.excerpt,
      coverImage: cms.coverImage?.url,
      published: true,
    },
    content: cms.content,
  };
}

// Convert microCMS case study to local CaseStudy format
function toCaseStudy(cms: CMSCaseStudy): CaseStudyLocal {
  return {
    slug: cms.slug || cms.id,
    frontmatter: {
      title: cms.title,
      date: cms.publishedAt?.split("T")[0] ?? cms.createdAt.split("T")[0],
      industry: cms.industry,
      tags: cms.tags ?? [],
      locale: getLocale(cms.locale),
      excerpt: cms.challenge.replace(/<[^>]*>/g, "").slice(0, 120) + "...",
      coverImage: cms.thumbnail?.url,
      published: true,
    },
    content: [
      `<h2 class="cms-section-heading cms-heading-challenge">課題</h2>${cms.challenge}`,
      `<h2 class="cms-section-heading cms-heading-solution">解決策</h2>${cms.solution}`,
      `<h2 class="cms-section-heading cms-heading-solution">成果</h2>${cms.result}`,
      cms.testimonial ? `<blockquote>${cms.testimonial}</blockquote>` : "",
    ]
      .filter(Boolean)
      .join("\n\n"),
  };
}

// Fetch blog posts by locale
export async function getCMSBlogPosts(locale: string): Promise<BlogPost[]> {
  try {
    const data = await client.getList<CMSBlog>({
      endpoint: "blogs",
      queries: {
        orders: "-publishedAt",
      },
      customRequestInit: {
        cache: "no-store",
      },
    });
    return data.contents
      .map(toBlogPost)
      .filter((p) => p.frontmatter.locale === locale);
  } catch {
    return [];
  }
}

// Fetch all tags from CMS blog posts
export async function getCMSAllTags(locale: string): Promise<string[]> {
  const posts = await getCMSBlogPosts(locale);
  const tagSet = new Set<string>();
  posts.forEach((p) => p.frontmatter.tags?.forEach((t) => tagSet.add(t)));
  return Array.from(tagSet).sort();
}

// Fetch a single blog post by ID
export async function getCMSBlogPost(id: string): Promise<BlogPost | null> {
  try {
    const data = await client.get<CMSBlog>({
      endpoint: "blogs",
      contentId: id,
      customRequestInit: {
        cache: "no-store",
      },
    });
    return toBlogPost(data);
  } catch {
    return null;
  }
}

// Fetch case studies by locale
export async function getCMSCaseStudies(
  locale: string
): Promise<CaseStudyLocal[]> {
  try {
    const data = await client.getList<CMSCaseStudy>({
      endpoint: "case-studies",
      queries: {
        orders: "-publishedAt",
      },
      customRequestInit: {
        cache: "no-store",
      },
    });
    return data.contents
      .map(toCaseStudy)
      .filter((s) => s.frontmatter.locale === locale);
  } catch {
    return [];
  }
}

// Fetch a single case study by slug (custom field) or content ID
export async function getCMSCaseStudy(
  slugOrId: string
): Promise<CaseStudyLocal | null> {
  try {
    // First try to find by custom slug field
    const list = await client.getList<CMSCaseStudy>({
      endpoint: "case-studies",
      queries: {
        filters: `slug[equals]${slugOrId}`,
        limit: 1,
      },
      customRequestInit: {
        cache: "no-store",
      },
    });
    if (list.contents.length > 0) {
      return toCaseStudy(list.contents[0]);
    }

    // Fallback: try by content ID
    const data = await client.get<CMSCaseStudy>({
      endpoint: "case-studies",
      contentId: slugOrId,
      customRequestInit: {
        cache: "no-store",
      },
    });
    return toCaseStudy(data);
  } catch {
    return null;
  }
}

// Fetch a single event by ID
export async function getCMSEvent(id: string): Promise<CMSEvent | null> {
  try {
    const data = await client.get<CMSEvent>({
      endpoint: "events",
      contentId: id,
      customRequestInit: {
        cache: "no-store",
      },
    });
    return data;
  } catch {
    return null;
  }
}

// Fetch all events (upcoming first, then past)
export async function getCMSEvents(): Promise<{ upcoming: CMSEvent[]; past: CMSEvent[] }> {
  try {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const data = await client.getList<CMSEvent>({
      endpoint: "events",
      queries: {
        orders: "date",
        limit: 100,
      },
      customRequestInit: {
        cache: "no-store",
      },
    });
    const upcoming: CMSEvent[] = [];
    const past: CMSEvent[] = [];
    for (const event of data.contents) {
      if (new Date(event.date) >= now) {
        upcoming.push(event);
      } else {
        past.push(event);
      }
    }
    past.reverse(); // most recent past events first
    return { upcoming, past };
  } catch {
    return { upcoming: [], past: [] };
  }
}

// Fetch the next upcoming event
export async function getCMSNextEvent(): Promise<CMSEvent | null> {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const data = await client.getList<CMSEvent>({
      endpoint: "events",
      queries: {
        filters: `date[greater_than]${yesterday.toISOString()}`,
        orders: "date",
        limit: 1,
      },
      customRequestInit: {
        cache: "no-store",
      },
    });
    return data.contents[0] ?? null;
  } catch {
    return null;
  }
}

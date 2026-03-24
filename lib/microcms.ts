import { createClient } from "microcms-js-sdk";
import type { MicroCMSListContent, MicroCMSImage } from "microcms-js-sdk";
import type {
  BlogPost,
  CaseStudy as CaseStudyLocal,
} from "@/lib/types";

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
    slug: cms.id,
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
    content: `<div>
      <h2>課題</h2>${cms.challenge}
      <h2>解決策</h2>${cms.solution}
      <h2>成果</h2>${cms.result}
      ${cms.testimonial ? `<blockquote>${cms.testimonial}</blockquote>` : ""}
    </div>`,
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
        next: { revalidate: 60 },
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
        next: { revalidate: 60 },
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
        next: { revalidate: 60 },
      },
    });
    return data.contents
      .map(toCaseStudy)
      .filter((s) => s.frontmatter.locale === locale);
  } catch {
    return [];
  }
}

// Fetch a single case study by ID
export async function getCMSCaseStudy(
  id: string
): Promise<CaseStudyLocal | null> {
  try {
    const data = await client.get<CMSCaseStudy>({
      endpoint: "case-studies",
      contentId: id,
      customRequestInit: {
        next: { revalidate: 60 },
      },
    });
    return toCaseStudy(data);
  } catch {
    return null;
  }
}

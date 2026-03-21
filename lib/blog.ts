import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { BlogPost, BlogFrontmatter } from "./types";

const contentDir = path.join(process.cwd(), "content/blog");

export function getBlogPosts(locale: string): BlogPost[] {
  const dir = path.join(contentDir, locale);

  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  const posts = files.map((file) => {
    const slug = file.replace(/\.(mdx|md)$/, "");
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    const { data, content } = matter(raw);

    return {
      slug,
      frontmatter: data as BlogFrontmatter,
      content,
    };
  });

  return posts
    .filter((p) => p.frontmatter.published !== false)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    );
}

export function getBlogPost(
  locale: string,
  slug: string
): BlogPost | undefined {
  const extensions = [".mdx", ".md"];

  for (const ext of extensions) {
    const filePath = path.join(contentDir, locale, `${slug}${ext}`);
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(raw);
      return { slug, frontmatter: data as BlogFrontmatter, content };
    }
  }

  return undefined;
}

export function getAllTags(locale: string): string[] {
  const posts = getBlogPosts(locale);
  const tagSet = new Set<string>();
  posts.forEach((p) => p.frontmatter.tags?.forEach((t) => tagSet.add(t)));
  return Array.from(tagSet).sort();
}

export function getPaginatedPosts(
  posts: BlogPost[],
  page: number,
  perPage = 6
) {
  const totalPages = Math.ceil(posts.length / perPage);
  const start = (page - 1) * perPage;
  return {
    posts: posts.slice(start, start + perPage),
    totalPages,
    currentPage: page,
  };
}

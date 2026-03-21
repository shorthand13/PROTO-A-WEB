import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { VideoMeta, VideoFrontmatter } from "./types";

const contentDir = path.join(process.cwd(), "content/videos");

export function getVideos(): VideoMeta[] {
  if (!fs.existsSync(contentDir)) return [];

  const files = fs.readdirSync(contentDir).filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));

  const videos = files.map((file) => {
    const slug = file.replace(/\.(mdx|md)$/, "");
    const raw = fs.readFileSync(path.join(contentDir, file), "utf-8");
    const { data, content } = matter(raw);

    return {
      slug,
      frontmatter: { ...data, slug } as VideoFrontmatter,
      content,
    };
  });

  return videos.sort(
    (a, b) =>
      new Date(b.frontmatter.publishedAt).getTime() -
      new Date(a.frontmatter.publishedAt).getTime()
  );
}

export function getVideo(slug: string): VideoMeta | undefined {
  const extensions = [".md", ".mdx"];

  for (const ext of extensions) {
    const filePath = path.join(contentDir, `${slug}${ext}`);
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(raw);
      return {
        slug,
        frontmatter: { ...data, slug } as VideoFrontmatter,
        content,
      };
    }
  }

  return undefined;
}

export function getVideoCategories(): string[] {
  const videos = getVideos();
  const cats = new Set<string>();
  videos.forEach((v) => cats.add(v.frontmatter.category));
  return Array.from(cats).sort();
}

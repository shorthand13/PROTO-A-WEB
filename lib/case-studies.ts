import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { CaseStudy, CaseStudyFrontmatter } from "./types";

const contentDir = path.join(process.cwd(), "content/case-studies");

export function getCaseStudies(locale: string): CaseStudy[] {
  const dir = path.join(contentDir, locale);

  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  const studies = files.map((file) => {
    const slug = file.replace(/\.(mdx|md)$/, "");
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    const { data, content } = matter(raw);

    return {
      slug,
      frontmatter: data as CaseStudyFrontmatter,
      content,
    };
  });

  return studies
    .filter((s) => s.frontmatter.published !== false)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    );
}

export function getCaseStudy(
  locale: string,
  slug: string
): CaseStudy | undefined {
  const extensions = [".mdx", ".md"];

  for (const ext of extensions) {
    const filePath = path.join(contentDir, locale, `${slug}${ext}`);
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(raw);
      return { slug, frontmatter: data as CaseStudyFrontmatter, content };
    }
  }

  return undefined;
}

export interface BlogFrontmatter {
  title: string;
  date: string;
  author: string;
  tags: string[];
  locale: string;
  excerpt: string;
  coverImage?: string;
  published: boolean;
}

export interface BlogPost {
  slug: string;
  frontmatter: BlogFrontmatter;
  content: string;
}

export interface CaseStudyFrontmatter {
  title: string;
  date: string;
  industry: string;
  tags?: string[];
  locale: string;
  excerpt: string;
  coverImage?: string;
  published: boolean;
}

export interface CaseStudy {
  slug: string;
  frontmatter: CaseStudyFrontmatter;
  content: string;
}

export interface VideoFrontmatter {
  title: string;
  description: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  locale: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration: string;
  publishedAt: string;
  // false = visible to everyone (e.g. homepage). true = requires sign-in.
  memberOnly: boolean;
  // Only meaningful when memberOnly is true. If present, only these emails
  // (case-insensitive) can view the video — a private per-client video.
  // Absent/empty = any signed-in member can view it.
  allowedEmails?: string[];
  slug: string;
}

export interface VideoMeta {
  slug: string;
  frontmatter: VideoFrontmatter;
  content: string;
}

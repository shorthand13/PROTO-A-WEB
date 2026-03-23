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
  memberOnly: boolean;
  slug: string;
}

export interface VideoMeta {
  slug: string;
  frontmatter: VideoFrontmatter;
  content: string;
}

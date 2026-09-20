import type { VideoMeta } from "./types";

/** Extracts the video ID from a youtube.com/watch, youtu.be, or /embed URL. */
export function getYouTubeVideoId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.slice(1) || null;
    if (u.pathname.startsWith("/embed/")) return u.pathname.replace("/embed/", "") || null;
    return u.searchParams.get("v");
  } catch {
    return null;
  }
}

/** youtube-nocookie.com embed URL for a stored watch/short URL, for use in an <iframe>. */
export function getYouTubeEmbedUrl(url: string): string {
  const id = getYouTubeVideoId(url);
  return id ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1` : url;
}

/** Thumbnail URL, falling back to YouTube's own hosted thumbnail when frontmatter has none. */
export function getVideoThumbnail(video: VideoMeta): string | null {
  if (video.frontmatter.thumbnailUrl) return video.frontmatter.thumbnailUrl;
  const id = getYouTubeVideoId(video.frontmatter.videoUrl);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

/**
 * Whether a signed-in user (by email) may view this specific video.
 * Public videos are viewable by anyone. Member-only videos need an active
 * session; if the video also has an allowedEmails list, the user's email
 * must be on it (case-insensitive) — otherwise it's shared with any member.
 */
export function canViewVideo(
  video: VideoMeta,
  userEmail: string | null | undefined
): boolean {
  if (!video.frontmatter.memberOnly) return true;
  if (!userEmail) return false;

  const allowed = video.frontmatter.allowedEmails;
  if (!allowed || allowed.length === 0) return true;

  return allowed.some((e) => e.toLowerCase() === userEmail.toLowerCase());
}

import { sanitizeHtml } from "@/lib/sanitize";

export default function SanitizedHtml({ html }: { html: string }) {
  return <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }} />;
}

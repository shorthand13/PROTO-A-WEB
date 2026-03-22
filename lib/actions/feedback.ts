"use server";

import { z } from "zod";

const feedbackSchema = z.object({
  rating: z.enum(["1", "2", "3", "4", "5"]),
  category: z.enum(["usability", "services", "content", "other"]),
  message: z.string().min(1).max(1000),
  page: z.string().optional(),
});

export type FeedbackState = {
  success: boolean;
  error: boolean;
};

export async function submitFeedback(
  _prevState: FeedbackState,
  formData: FormData
): Promise<FeedbackState> {
  const screenshot = (formData.get("screenshot") as string) || "";
  const raw = {
    rating: formData.get("rating"),
    category: formData.get("category"),
    message: formData.get("message"),
    page: formData.get("page"),
  };

  const result = feedbackSchema.safeParse(raw);

  if (!result.success) {
    return { success: false, error: true };
  }

  // Send LINE notification first (small payload, fast)
  const lineToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const lineUserIds =
    process.env.LINE_ADMIN_USER_IDS?.split(",")
      .map((id) => id.trim())
      .filter(Boolean) ?? [];

  if (lineToken && lineUserIds.length > 0) {
    const stars = "★".repeat(Number(result.data.rating)) + "☆".repeat(5 - Number(result.data.rating));
    const lineMessage = [
      "💬 新しいフィードバック",
      `評価: ${stars}`,
      `カテゴリ: ${result.data.category}`,
      `内容: ${result.data.message}`,
      result.data.page ? `ページ: ${result.data.page}` : null,
      `送信日時: ${new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}`,
    ]
      .filter(Boolean)
      .join("\n");

    await Promise.all(
      lineUserIds.map(async (userId) => {
        try {
          await fetch("https://api.line.me/v2/bot/message/push", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${lineToken}`,
            },
            body: JSON.stringify({
              to: userId,
              messages: [{ type: "text", text: lineMessage }],
            }),
          });
        } catch (err) {
          console.error(`LINE push error for ${userId}:`, err);
        }
      })
    );
  }

  // Send to webhook (includes large screenshot payload)
  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;

  if (webhookUrl) {
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "feedback",
          rating: result.data.rating,
          category: result.data.category,
          message: result.data.message,
          page: result.data.page ?? "",
          screenshot: screenshot || "",
          submittedAt: new Date().toISOString(),
        }),
      });

      if (!res.ok) {
        console.error("Feedback webhook failed:", res.status, await res.text());
      }
    } catch (err) {
      console.error("Feedback webhook error:", err);
    }
  }

  return { success: true, error: false };
}

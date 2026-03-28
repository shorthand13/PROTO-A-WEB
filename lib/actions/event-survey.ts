"use server";

import { z } from "zod";

const eventSurveySchema = z.object({
  eventId: z.string().min(1),
  eventTitle: z.string().min(1),
  rating: z.string().min(1),
  helpful: z.string().max(1000).optional().default(""),
  suggestions: z.string().max(1000).optional().default(""),
});

export type EventSurveyState = {
  success: boolean;
  error: boolean;
};

export async function submitEventSurvey(
  _prevState: EventSurveyState,
  formData: FormData
): Promise<EventSurveyState> {
  const raw = {
    eventId: formData.get("eventId"),
    eventTitle: formData.get("eventTitle"),
    rating: formData.get("rating"),
    helpful: formData.get("helpful") || undefined,
    suggestions: formData.get("suggestions") || undefined,
  };

  const result = eventSurveySchema.safeParse(raw);
  if (!result.success) return { success: false, error: true };

  const data = result.data;

  // Send LINE notification
  const lineToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const lineUserIds =
    process.env.LINE_ADMIN_USER_IDS?.split(",")
      .map((id) => id.trim())
      .filter(Boolean) ?? [];

  if (lineToken && lineUserIds.length > 0) {
    const stars = "★".repeat(Number(data.rating)) + "☆".repeat(5 - Number(data.rating));
    const lineMessage = [
      "📝 セミナーアンケート回答",
      `イベント: ${data.eventTitle}`,
      `満足度: ${stars} (${data.rating}/5)`,
      `役に立った点: ${data.helpful || "未記入"}`,
      `改善の提案: ${data.suggestions || "未記入"}`,
      `回答日時: ${new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}`,
    ].join("\n");

    await Promise.all(
      lineUserIds.map(async (uid) => {
        try {
          await fetch("https://api.line.me/v2/bot/message/push", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${lineToken}`,
            },
            body: JSON.stringify({
              to: uid,
              messages: [{ type: "text", text: lineMessage }],
            }),
          });
        } catch (err) {
          console.error(`LINE push error for ${uid}:`, err);
        }
      })
    );
  }

  // Send to Google Sheets webhook
  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "event-survey",
          eventId: data.eventId,
          eventTitle: data.eventTitle,
          rating: data.rating,
          helpful: data.helpful,
          suggestions: data.suggestions,
          submittedAt: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.error("Event survey webhook error:", err);
    }
  }

  return { success: true, error: false };
}

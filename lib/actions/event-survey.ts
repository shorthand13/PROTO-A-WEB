"use server";

import { z } from "zod";
import { createBrevoContact } from "@/lib/brevo";

const eventSurveySchema = z.object({
  eventId: z.string().min(1),
  eventTitle: z.string().min(1),
  name: z.string().min(1).max(200),
  email: z.string().email(),
  rating: z.string().min(1),
  instructorRating: z.string().min(1),
  wouldRefer: z.string().optional().default(""),
  referReason: z.string().max(2000).optional().default(""),
  feedback: z.string().max(2000).optional().default(""),
  improvements: z.string().max(2000).optional().default(""),
  serviceInterest: z.string().optional().default(""),
  wantInfo: z.string().optional().default(""),
  consultation: z.string().optional().default(""),
});

export type EventSurveyState = {
  success: boolean;
  error: boolean;
};

export async function submitEventSurvey(
  _prevState: EventSurveyState,
  formData: FormData
): Promise<EventSurveyState> {
  // serviceInterest can have multiple values (checkboxes)
  const serviceInterestValues = formData.getAll("serviceInterest").join(", ");

  const raw = {
    eventId: formData.get("eventId"),
    eventTitle: formData.get("eventTitle"),
    name: formData.get("name") || "",
    email: formData.get("email") || "",
    rating: formData.get("rating"),
    instructorRating: formData.get("instructorRating"),
    wouldRefer: formData.get("wouldRefer") || "",
    referReason: formData.get("referReason") || "",
    feedback: formData.get("feedback") || "",
    improvements: formData.get("improvements") || "",
    serviceInterest: serviceInterestValues,
    wantInfo: formData.get("wantInfo") || "",
    consultation: formData.get("consultation") || "",
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
    const instructorStars = "★".repeat(Number(data.instructorRating)) + "☆".repeat(5 - Number(data.instructorRating));
    const lineMessage = [
      "📝 セミナーアンケート回答",
      `イベント: ${data.eventTitle}`,
      `名前: ${data.name || "未記入"}`,
      `メール: ${data.email || "未記入"}`,
      `満足度: ${stars} (${data.rating}/5)`,
      `講師: ${instructorStars} (${data.instructorRating}/5)`,
      `紹介意向: ${data.wouldRefer || "未回答"}`,
      data.wouldRefer === "yes" ? `紹介理由: ${data.referReason || "未記入"}` : null,
      `感想: ${data.feedback || "未記入"}`,
      `改善点: ${data.improvements || "未記入"}`,
      `関心サービス: ${data.serviceInterest || "未選択"}`,
      `案内希望: ${data.wantInfo || "未回答"}`,
      `無料相談: ${data.consultation || "未回答"}`,
      `回答日時: ${new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}`,
    ].filter(Boolean).join("\n");

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
          name: data.name,
          email: data.email,
          rating: data.rating,
          instructorRating: data.instructorRating,
          wouldRefer: data.wouldRefer,
          referReason: data.referReason,
          feedback: data.feedback,
          improvements: data.improvements,
          serviceInterest: data.serviceInterest,
          wantInfo: data.wantInfo,
          consultation: data.consultation,
          submittedAt: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.error("Event survey webhook error:", err);
    }
  }

  await createBrevoContact(data.email, {
    FIRSTNAME: data.name,
  }, [10]);

  return { success: true, error: false };
}

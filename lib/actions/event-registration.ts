"use server";

import { z } from "zod";

const eventRegistrationSchema = z.object({
  eventId: z.string().min(1),
  eventTitle: z.string().min(1),
  name: z.string().min(1).max(200),
  email: z.string().email(),
  company: z.string().max(200).optional().default(""),
  message: z.string().max(1000).optional().default(""),
});

export type EventRegistrationState = {
  success: boolean;
  error: boolean;
};

export async function submitEventRegistration(
  _prevState: EventRegistrationState,
  formData: FormData
): Promise<EventRegistrationState> {
  const raw = {
    eventId: formData.get("eventId"),
    eventTitle: formData.get("eventTitle"),
    name: formData.get("name"),
    email: formData.get("email"),
    company: formData.get("company") || undefined,
    message: formData.get("message") || undefined,
  };

  const result = eventRegistrationSchema.safeParse(raw);
  if (!result.success) return { success: false, error: true };

  const data = result.data;

  // Send LINE notification
  const lineToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const lineUserIds =
    process.env.LINE_ADMIN_USER_IDS?.split(",")
      .map((id) => id.trim())
      .filter(Boolean) ?? [];

  if (lineToken && lineUserIds.length > 0) {
    const lineMessage = [
      "📅 イベント申し込み",
      `イベント: ${data.eventTitle}`,
      `名前: ${data.name}`,
      `メール: ${data.email}`,
      `会社名: ${data.company || "未記入"}`,
      `メッセージ: ${data.message || "なし"}`,
      `申込日時: ${new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}`,
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
          type: "event-registration",
          eventId: data.eventId,
          eventTitle: data.eventTitle,
          name: data.name,
          email: data.email,
          company: data.company,
          message: data.message,
          submittedAt: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.error("Event registration webhook error:", err);
    }
  }

  return { success: true, error: false };
}

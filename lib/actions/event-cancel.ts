"use server";

import { z } from "zod";
import crypto from "crypto";

const cancelSchema = z.object({
  eventId: z.string().min(1),
  eventTitle: z.string().min(1),
  email: z.string().email(),
  token: z.string().min(1),
});

export type EventCancelState = {
  success: boolean;
  error: boolean;
};

// Generate a cancel token from email + eventId
export async function generateCancelToken(email: string, eventId: string): Promise<string> {
  const secret = process.env.RESEND_API_KEY || "fallback-secret";
  return crypto
    .createHmac("sha256", secret)
    .update(`${email}:${eventId}`)
    .digest("hex")
    .slice(0, 16);
}

export async function submitEventCancel(
  _prevState: EventCancelState,
  formData: FormData
): Promise<EventCancelState> {
  const raw = {
    eventId: formData.get("eventId"),
    eventTitle: formData.get("eventTitle"),
    email: formData.get("email"),
    token: formData.get("token"),
  };

  const result = cancelSchema.safeParse(raw);
  if (!result.success) return { success: false, error: true };

  const data = result.data;

  // Verify token
  const expectedToken = await generateCancelToken(data.email, data.eventId);
  if (data.token !== expectedToken) return { success: false, error: true };

  // Send LINE notification
  const lineToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const lineUserIds =
    process.env.LINE_ADMIN_USER_IDS?.split(",")
      .map((id) => id.trim())
      .filter(Boolean) ?? [];

  if (lineToken && lineUserIds.length > 0) {
    const lineMessage = [
      "❌ イベントキャンセル",
      `イベント: ${data.eventTitle}`,
      `メール: ${data.email}`,
      `キャンセル日時: ${new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}`,
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
          type: "event-cancellation",
          eventId: data.eventId,
          eventTitle: data.eventTitle,
          email: data.email,
          submittedAt: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.error("Event cancellation webhook error:", err);
    }
  }

  return { success: true, error: false };
}

"use server";

import { z } from "zod";
import { Resend } from "resend";
import { getCMSEvent } from "@/lib/microcms";
import { generateCancelToken } from "@/lib/actions/event-cancel";

const resend = new Resend(process.env.RESEND_API_KEY);

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
  data?: {
    name: string;
    email: string;
    eventTitle: string;
  };
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

  // Fetch full event details for email
  const event = await getCMSEvent(data.eventId);

  // Build event details sections for email
  let eventDetailsHtml = "";

  if (event) {
    const dateObj = new Date(event.date);
    const formattedDate = dateObj.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });

    eventDetailsHtml += `
      <p style="margin: 4px 0; color: #555;">📅 ${formattedDate}${event.time ? ` ${event.time}` : ""}</p>
    `;

    if (event.location) {
      eventDetailsHtml += `<p style="margin: 4px 0; color: #555;">📍 ${event.location}</p>`;
    }

    if (event.price) {
      eventDetailsHtml += `<p style="margin: 4px 0; color: #555;">🎫 参加費：${event.price}</p>`;
    }

    if (event.eventFormat) {
      eventDetailsHtml += `<p style="margin: 4px 0; color: #555;">💻 ${event.eventFormat}</p>`;
    }

    if (event.description) {
      eventDetailsHtml += `
        <div style="margin-top: 16px;">
          <p style="font-weight: bold; color: #333; margin-bottom: 6px;">イベント概要</p>
          <p style="color: #555; line-height: 1.6; white-space: pre-line;">${event.description.replace(/<[^>]*>/g, "")}</p>
        </div>
      `;
    }

    if (event.targetAudience) {
      eventDetailsHtml += `
        <div style="margin-top: 16px;">
          <p style="font-weight: bold; color: #333; margin-bottom: 6px;">対象者</p>
          <p style="color: #555; line-height: 1.6; white-space: pre-line;">${event.targetAudience}</p>
        </div>
      `;
    }

    if (event.learnings) {
      const items = event.learnings.split("\n").filter(Boolean);
      eventDetailsHtml += `
        <div style="margin-top: 16px;">
          <p style="font-weight: bold; color: #333; margin-bottom: 6px;">学べること</p>
          ${items.map((item) => `<p style="margin: 4px 0; color: #555;">✓ ${item}</p>`).join("")}
        </div>
      `;
    }

    if (event.requirements) {
      const items = event.requirements.split("\n").filter(Boolean);
      eventDetailsHtml += `
        <div style="margin-top: 16px;">
          <p style="font-weight: bold; color: #333; margin-bottom: 6px;">持ち物</p>
          ${items.map((item) => `<p style="margin: 4px 0; color: #555;">▸ ${item}</p>`).join("")}
        </div>
      `;
    }
  }

  // Generate cancel URL
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://protoa.digital";
  const cancelToken = await generateCancelToken(data.email, data.eventId);
  const cancelUrl = `${baseUrl}/ja/events/${data.eventId}/cancel?email=${encodeURIComponent(data.email)}&token=${cancelToken}`;

  // Send confirmation email
  try {
    await resend.emails.send({
      from: "ProtoA <noreply@protoa.digital>",
      to: data.email,
      subject: `【参加登録完了】${data.eventTitle}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #6b9e9e; margin-bottom: 16px;">参加登録が完了しました</h2>
          <p>${data.name} 様</p>
          <p>以下のイベントへの参加登録を承りました。</p>
          <div style="background: #f8f6f3; border-radius: 12px; padding: 20px; margin: 20px 0;">
            ${event?.image ? `<img src="${event.image.url}" alt="${data.eventTitle}" style="width: 100%; border-radius: 8px; margin-bottom: 16px;" />` : ""}
            <p style="font-weight: bold; font-size: 16px; margin: 0 0 8px;">${data.eventTitle}</p>
            ${eventDetailsHtml}
          </div>
          <p>当日のご参加をお待ちしております。</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="font-size: 12px; color: #999;">
            参加をキャンセルされる場合は<a href="${cancelUrl}" style="color: #6b9e9e;">こちら</a>からお手続きください。
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="font-size: 12px; color: #999;">
            このメールは自動送信されています。<br />
            ご不明な点がございましたら、お気軽にお問い合わせください。
          </p>
          <p style="font-size: 12px; color: #999;">ProtoA</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Confirmation email error:", err);
  }

  return {
    success: true,
    error: false,
    data: {
      name: data.name,
      email: data.email,
      eventTitle: data.eventTitle,
    },
  };
}

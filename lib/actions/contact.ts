"use server";

import { contactSchema } from "@/lib/validations/contact";

export type ContactState = {
  success: boolean;
  error: boolean;
  fieldErrors?: Record<string, string[]>;
};

export async function submitContact(
  _prevState: ContactState,
  formData: FormData
): Promise<ContactState> {
  const raw = {
    name: formData.get("name"),
    company: formData.get("company"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    message: formData.get("message"),
  };

  const result = contactSchema.safeParse(raw);

  if (!result.success) {
    return {
      success: false,
      error: true,
      fieldErrors: result.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { name, company, phone, email, message } = result.data;

  // Send LINE push message notification
  const lineToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const lineUserId = process.env.LINE_ADMIN_USER_ID;

  if (lineToken && lineUserId) {
    try {
      const lineMessage = [
        "📩 新しいお問い合わせ",
        `名前: ${name}`,
        company ? `会社: ${company}` : null,
        phone ? `電話: ${phone}` : null,
        `メール: ${email}`,
        `内容: ${message}`,
        `送信日時: ${new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}`,
      ]
        .filter(Boolean)
        .join("\n");

      const res = await fetch("https://api.line.me/v2/bot/message/push", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${lineToken}`,
        },
        body: JSON.stringify({
          to: lineUserId,
          messages: [{ type: "text", text: lineMessage }],
        }),
      });

      if (!res.ok) {
        console.error("LINE push failed:", res.status, await res.text());
      }
    } catch (err) {
      console.error("LINE push error:", err);
    }
  }

  // Send to webhook (Google Sheets, etc.)
  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;

  if (webhookUrl) {
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...result.data,
          submittedAt: new Date().toISOString(),
        }),
      });

      if (!res.ok) {
        console.error("Webhook failed:", res.status, await res.text());
      }
    } catch (err) {
      console.error("Webhook error:", err);
    }
  }

  if (!lineToken && !webhookUrl) {
    console.log("Contact form submission (no notification configured):", result.data);
  }

  return { success: true, error: false };
}

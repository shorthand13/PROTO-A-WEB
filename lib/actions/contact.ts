"use server";

import { contactSchema } from "@/lib/validations/contact";
import { createBrevoContact } from "@/lib/brevo";

export type ContactState = {
  success: boolean;
  error: boolean;
  fieldErrors?: Record<string, string[]>;
  values?: Record<string, string>;
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

  const values = {
    name: String(raw.name || ""),
    company: String(raw.company || ""),
    phone: String(raw.phone || ""),
    email: String(raw.email || ""),
    message: String(raw.message || ""),
  };

  if (!result.success) {
    return {
      success: false,
      error: true,
      fieldErrors: result.error.flatten().fieldErrors as Record<string, string[]>,
      values,
    };
  }

  const { name, company, phone, email, message } = result.data;

  // Send LINE push message notification to all admins
  const lineToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const lineUserIds = process.env.LINE_ADMIN_USER_IDS?.split(",").map((id) => id.trim()).filter(Boolean) ?? [];

  if (lineToken && lineUserIds.length > 0) {
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

    await Promise.all(
      lineUserIds.map(async (userId) => {
        try {
          const res = await fetch("https://api.line.me/v2/bot/message/push", {
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

          if (!res.ok) {
            console.error(`LINE push failed for ${userId}:`, res.status, await res.text());
          }
        } catch (err) {
          console.error(`LINE push error for ${userId}:`, err);
        }
      })
    );
  }

  // Send to webhook (Google Sheets, etc.)
  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;

  if (webhookUrl) {
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "contact",
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

  await createBrevoContact(email, {
    FIRSTNAME: name,
    COMPANY_NAME: company || undefined,
    PHONE_NUMBER: phone || undefined,
    MESSAGE: message,
  }, [7]);

  return { success: true, error: false };
}

"use server";

import { z } from "zod";
import { createBrevoContact } from "@/lib/brevo";

const surveySchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  company: z.string().min(1).max(200),
  industry: z.string().min(1),
  companySize: z.string().min(1),
  challenges: z.string().min(1),
  dxStatus: z.string().min(1),
  dxBarriers: z.string().min(1),
  desiredSupport: z.string().min(1),
});

export type SurveyState = {
  success: boolean;
  error: boolean;
};

export async function submitSurvey(
  _prevState: SurveyState,
  formData: FormData
): Promise<SurveyState> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    company: formData.get("company"),
    industry: formData.get("industry"),
    companySize: formData.get("companySize"),
    challenges: formData.get("challenges"),
    dxStatus: formData.get("dxStatus"),
    dxBarriers: formData.get("dxBarriers"),
    desiredSupport: formData.get("desiredSupport"),
  };

  const result = surveySchema.safeParse(raw);
  if (!result.success) return { success: false, error: true };

  const data = result.data;

  // Send LINE notification first
  const lineToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const lineUserIds =
    process.env.LINE_ADMIN_USER_IDS?.split(",")
      .map((id) => id.trim())
      .filter(Boolean) ?? [];

  if (lineToken && lineUserIds.length > 0) {
    const lineMessage = [
      "📋 新しいアンケート回答",
      `名前: ${data.name}`,
      `メール: ${data.email}`,
      `会社名: ${data.company}`,
      `業種: ${data.industry}`,
      `従業員規模: ${data.companySize}`,
      `経営課題: ${data.challenges}`,
      `DX状況: ${data.dxStatus}`,
      `DXの壁: ${data.dxBarriers}`,
      `希望する支援: ${data.desiredSupport}`,
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
          type: "survey",
          name: data.name,
          email: data.email,
          company: data.company,
          industry: data.industry,
          companySize: data.companySize,
          challenges: data.challenges,
          dxStatus: data.dxStatus,
          dxBarriers: data.dxBarriers,
          desiredSupport: data.desiredSupport,
          submittedAt: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.error("Survey webhook error:", err);
    }
  }

  await createBrevoContact(data.email, {
    FIRSTNAME: data.name,
    COMPANY_NAME: data.company,
  }, [9]);

  return { success: true, error: false };
}

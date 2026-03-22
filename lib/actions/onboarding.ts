"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";

const onboardingSchema = z.object({
  company: z.string().min(1).max(200),
  industry: z.string().min(1),
  companySize: z.string().min(1),
  challenges: z.string().min(1),        // comma-separated, up to 3
  dxStatus: z.string().min(1),           // at least 1
  dxBarriers: z.string().min(1),         // comma-separated, top 3
  desiredSupport: z.string().min(1),     // comma-separated, up to 3
});

export type OnboardingState = {
  success: boolean;
  error: boolean;
};

export async function submitOnboarding(
  _prevState: OnboardingState,
  formData: FormData
): Promise<OnboardingState> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: true };

  const raw = {
    company: formData.get("company"),
    industry: formData.get("industry"),
    companySize: formData.get("companySize"),
    challenges: formData.get("challenges"),
    dxStatus: formData.get("dxStatus"),
    dxBarriers: formData.get("dxBarriers"),
    desiredSupport: formData.get("desiredSupport"),
  };

  const result = onboardingSchema.safeParse(raw);
  if (!result.success) return { success: false, error: true };

  const data = result.data;

  // Save to Clerk user metadata
  try {
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        ...data,
        onboardingComplete: true,
      },
    });
  } catch (err) {
    console.error("Clerk metadata update error:", err);
    return { success: false, error: true };
  }

  // Fetch user info for webhook and LINE notification
  let userName = "";
  let userEmail = "";
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    userName = user.fullName || `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.username || "";
    userEmail = user.emailAddresses[0]?.emailAddress ?? "";
  } catch (err) {
    console.error("Failed to fetch user info:", err);
  }

  // Send to Google Sheets webhook
  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "registration",
          name: userName || userEmail,
          email: userEmail,
          company: data.company,
          industry: data.industry,
          companySize: data.companySize,
          challenges: data.challenges,
          dxStatus: data.dxStatus,
          dxBarriers: data.dxBarriers,
          desiredSupport: data.desiredSupport,
          registeredAt: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.error("Registration webhook error:", err);
    }
  }

  // Send LINE notification
  const lineToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const lineUserIds =
    process.env.LINE_ADMIN_USER_IDS?.split(",")
      .map((id) => id.trim())
      .filter(Boolean) ?? [];

  if (lineToken && lineUserIds.length > 0) {
    const lineMessage = [
      "🎉 新規会員登録",
      `名前: ${userName || "未設定"}`,
      `メール: ${userEmail}`,
      `会社名: ${data.company}`,
      `業種: ${data.industry}`,
      `従業員規模: ${data.companySize}`,
      `経営課題: ${data.challenges}`,
      `DX状況: ${data.dxStatus}`,
      `DXの壁: ${data.dxBarriers}`,
      `希望する支援: ${data.desiredSupport}`,
      `登録日時: ${new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}`,
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

  return { success: true, error: false };
}

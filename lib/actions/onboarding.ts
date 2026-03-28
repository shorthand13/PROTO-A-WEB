"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";

const onboardingSchema = z.object({
  userType: z.enum(["corporation", "sole-proprietor", "individual"]),
  lastName: z.string().min(1).max(100),
  firstName: z.string().min(1).max(100),
  company: z.string().max(200).optional().default(""),
  industry: z.string().optional().default(""),
  companySize: z.string().optional().default(""),
  challenges: z.string().min(1),        // comma-separated, up to 3
  challengesOther: z.string().optional().default(""),
  dxStatus: z.string().min(1),           // at least 1
  dxBarriers: z.string().min(1),         // comma-separated, top 3
  dxBarriersOther: z.string().optional().default(""),
  desiredSupport: z.string().min(1),     // comma-separated, up to 3
  desiredSupportOther: z.string().optional().default(""),
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
    userType: formData.get("userType"),
    lastName: formData.get("lastName"),
    firstName: formData.get("firstName"),
    company: formData.get("company") || undefined,
    industry: formData.get("industry") || undefined,
    companySize: formData.get("companySize") || undefined,
    challenges: formData.get("challenges"),
    challengesOther: formData.get("challengesOther") || undefined,
    dxStatus: formData.get("dxStatus"),
    dxBarriers: formData.get("dxBarriers"),
    dxBarriersOther: formData.get("dxBarriersOther") || undefined,
    desiredSupport: formData.get("desiredSupport"),
    desiredSupportOther: formData.get("desiredSupportOther") || undefined,
  };

  const result = onboardingSchema.safeParse(raw);
  if (!result.success) return { success: false, error: true };

  const data = result.data;

  // Save to Clerk user metadata
  try {
    const client = await clerkClient();
    // Update user's first/last name if provided via onboarding
    if (data.firstName || data.lastName) {
      await client.users.updateUser(userId, {
        firstName: data.firstName || "",
        lastName: data.lastName || "",
      });
    }
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
  let userName = `${data.lastName} ${data.firstName}`.trim();
  let userEmail = "";
  let provider = "email";
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    if (!userName) {
      userName = user.fullName || `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.username || "";
    }
    userEmail = user.emailAddresses[0]?.emailAddress ?? "";
    provider = user.externalAccounts?.[0]?.provider ?? "email";
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
          userType: data.userType,
          lastName: data.lastName,
          firstName: data.firstName,
          email: userEmail,
          company: data.company || "",
          industry: data.industry,
          companySize: data.companySize,
          challenges: data.challenges,
          challengesOther: data.challengesOther || "",
          dxStatus: data.dxStatus,
          dxBarriers: data.dxBarriers,
          dxBarriersOther: data.dxBarriersOther || "",
          desiredSupport: data.desiredSupport,
          desiredSupportOther: data.desiredSupportOther || "",
          provider,
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
    const userTypeLabel = data.userType === "corporation" ? "法人" : data.userType === "sole-proprietor" ? "個人事業主" : "個人";
    const lineMessage = [
      "🎉 新規会員登録",
      `種別: ${userTypeLabel}`,
      `姓: ${data.lastName || "未設定"}`,
      `名: ${data.firstName || "未設定"}`,
      `メール: ${userEmail}`,
      `会社名: ${data.company || "なし"}`,
      `業種: ${data.industry}`,
      `従業員規模: ${data.companySize}`,
      `経営課題: ${data.challenges}${data.challengesOther ? `（その他: ${data.challengesOther}）` : ""}`,
      `DX状況: ${data.dxStatus}`,
      `DXの壁: ${data.dxBarriers}${data.dxBarriersOther ? `（その他: ${data.dxBarriersOther}）` : ""}`,
      `希望する支援: ${data.desiredSupport}${data.desiredSupportOther ? `（その他: ${data.desiredSupportOther}）` : ""}`,
      `登録方法: ${provider}`,
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

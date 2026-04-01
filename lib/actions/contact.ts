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

  // Create Asana task
  const asanaToken = process.env.ASANA_ACCESS_TOKEN;
  const asanaProjectGid = process.env.ASANA_PROJECT_GID;

  if (asanaToken && asanaProjectGid) {
    const taskName = `お問い合わせ: ${name}${company ? ` (${company})` : ""}`;
    const taskNotes = [
      `名前: ${name}`,
      company ? `会社: ${company}` : null,
      phone ? `電話: ${phone}` : null,
      `メール: ${email}`,
      ``,
      `メッセージ:`,
      message,
      ``,
      `送信日時: ${new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}`,
    ]
      .filter((line) => line !== null)
      .join("\n");

    try {
      const res = await fetch("https://app.asana.com/api/1.0/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${asanaToken}`,
        },
        body: JSON.stringify({
          data: {
            name: taskName,
            notes: taskNotes,
            projects: [asanaProjectGid],
          },
        }),
      });

      if (!res.ok) {
        console.error("Asana task creation failed:", res.status, await res.text());
      }
    } catch (err) {
      console.error("Asana task creation error:", err);
    }
  }

  // Create HubSpot contact and deal
  const hubspotToken = process.env.HUBSPOT_ACCESS_TOKEN;
  const hubspotPipelineId = process.env.HUBSPOT_PIPELINE_ID || "default";
  const hubspotStageId = process.env.HUBSPOT_STAGE_ID;

  if (hubspotToken) {
    let contactId: string | undefined;

    try {
      const res = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${hubspotToken}`,
        },
        body: JSON.stringify({
          properties: {
            firstname: name,
            email,
            phone: phone || undefined,
            company: company || undefined,
            hs_lead_status: "NEW",
          },
        }),
      });

      if (res.status === 409) {
        // Contact already exists — update instead
        const existing = await res.json();
        contactId = existing.message?.match(/ID: (\d+)/)?.[1];
        if (contactId) {
          await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${hubspotToken}`,
            },
            body: JSON.stringify({
              properties: {
                phone: phone || undefined,
                company: company || undefined,
              },
            }),
          });
        }
      } else if (res.ok) {
        const created = await res.json();
        contactId = created.id;
      } else {
        console.error("HubSpot contact creation failed:", res.status, await res.text());
      }
    } catch (err) {
      console.error("HubSpot contact creation error:", err);
    }

    // Create a deal and associate with the contact
    if (contactId) {
      try {
        const dealName = `お問い合わせ: ${name}${company ? ` (${company})` : ""}`;
        const dealRes = await fetch("https://api.hubapi.com/crm/v3/objects/deals", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${hubspotToken}`,
          },
          body: JSON.stringify({
            properties: {
              dealname: dealName,
              pipeline: hubspotPipelineId,
              ...(hubspotStageId ? { dealstage: hubspotStageId } : {}),
              description: message,
            },
            associations: [
              {
                to: { id: contactId },
                types: [
                  {
                    associationCategory: "HUBSPOT_DEFINED",
                    associationTypeId: 3,
                  },
                ],
              },
            ],
          }),
        });

        if (!dealRes.ok) {
          console.error("HubSpot deal creation failed:", dealRes.status, await dealRes.text());
        }
      } catch (err) {
        console.error("HubSpot deal creation error:", err);
      }
    }
  }

  return { success: true, error: false };
}

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
        return { success: false, error: true };
      }
    } catch (err) {
      console.error("Webhook error:", err);
      return { success: false, error: true };
    }
  } else {
    console.log("Contact form submission (no webhook configured):", result.data);
  }

  return { success: true, error: false };
}

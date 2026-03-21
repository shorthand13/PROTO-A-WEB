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

  // TODO: Send email or store in database
  console.log("Contact form submission:", result.data);

  return { success: true, error: false };
}

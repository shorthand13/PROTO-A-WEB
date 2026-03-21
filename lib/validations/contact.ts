import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1, "nameRequired"),
  company: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().min(1, "emailRequired").email("emailInvalid"),
  message: z.string().min(1, "messageRequired").min(10, "messageMinLength"),
});

export type ContactFormData = z.infer<typeof contactSchema>;

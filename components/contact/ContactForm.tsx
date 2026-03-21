"use client";

import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { submitContact, type ContactState } from "@/lib/actions/contact";

const initialState: ContactState = { success: false, error: false };

export default function ContactForm() {
  const t = useTranslations("Contact");
  const [state, formAction, isPending] = useActionState(
    submitContact,
    initialState
  );

  if (state.success) {
    return (
      <div className="rounded-2xl bg-primary-light/20 border border-primary/20 p-6 text-center">
        <p className="text-lg font-medium text-primary">{t("form.success")}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground">
          {t("form.name")} <span className="text-accent">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder={t("form.namePlaceholder")}
          className="mt-1 block w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
        />
        {state.fieldErrors?.name && (
          <p className="mt-1 text-sm text-accent">
            {t(`validation.${state.fieldErrors.name[0]}`)}
          </p>
        )}
      </div>

      {/* Company */}
      <div>
        <label htmlFor="company" className="block text-sm font-medium text-foreground">
          {t("form.company")}
        </label>
        <input
          id="company"
          name="company"
          type="text"
          placeholder={t("form.companyPlaceholder")}
          className="mt-1 block w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
        />
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-foreground">
          {t("form.phone")}
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          placeholder={t("form.phonePlaceholder")}
          className="mt-1 block w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground">
          {t("form.email")} <span className="text-accent">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder={t("form.emailPlaceholder")}
          className="mt-1 block w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
        />
        {state.fieldErrors?.email && (
          <p className="mt-1 text-sm text-accent">
            {t(`validation.${state.fieldErrors.email[0]}`)}
          </p>
        )}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-foreground">
          {t("form.message")} <span className="text-accent">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder={t("form.messagePlaceholder")}
          className="mt-1 block w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-y"
        />
        {state.fieldErrors?.message && (
          <p className="mt-1 text-sm text-accent">
            {t(`validation.${state.fieldErrors.message[0]}`)}
          </p>
        )}
      </div>

      {state.error && !state.fieldErrors && (
        <p className="text-sm text-accent">{t("form.error")}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-cta px-8 py-4 text-lg font-bold text-white hover:bg-cta-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? t("form.sending") : t("form.submit")}
      </button>
    </form>
  );
}

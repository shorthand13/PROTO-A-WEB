# CLAUDE.md

Guidance for Claude Code working in this repository.

## Project

ProtoA — a Miyakojima-based DX支援 (DX support) company website. Bilingual (Japanese primary, English secondary). Live at protoa.digital.

## Commands

```bash
npm run dev      # Dev server at localhost:3000
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint
```

No test framework configured. Verify changes by running `npm run build` and checking the dev server.

## Stack

- **Next.js 16** App Router, **React 19**, **TypeScript** (strict)
- **Tailwind CSS v4** — CSS-first via `@import "tailwindcss"` in `app/globals.css`. No `tailwind.config.js`. Theme via CSS variables.
- **next-intl** for i18n — locale in URL (`/ja`, `/en`), messages in `messages/ja.json` and `messages/en.json`
- **Clerk** for auth (member area)
- **microCMS** for blog content
- **Resend** for transactional email
- **Vercel** deployment, auto-deploys from `main`

## Structure

- `app/[locale]/` — localized pages. Root layout is `app/[locale]/layout.tsx`.
- `components/` — shared React components
- `lib/actions/` — server actions for forms (contact, event-registration, event-cancel, event-survey, survey, feedback, onboarding)
- `messages/` — i18n translations (`ja.json`, `en.json`)
- `public/` — static assets
- `docs/` — architecture diagrams and marketing plans
- Path alias `@/` → project root

Dark mode uses CSS `prefers-color-scheme`, not Tailwind's `darkMode` config.

## Integrations (via server actions)

| Service | Used for | Env var |
|---------|---------|---------|
| Brevo | CRM contacts, newsletter | `BREVO_API_KEY` |
| LINE | Notifications on form submit | `LINE_CHANNEL_ACCESS_TOKEN`, `LINE_USER_ID` |
| Google Sheets | Form submission log | `GOOGLE_SHEETS_WEBHOOK_URL` |
| Resend | Event confirmation emails | `RESEND_API_KEY` |
| Clerk | Member auth | Clerk env vars |
| microCMS | Blog CMS | microCMS env vars |

**Email sender**: `noreply@protoa.digital` (transactional), `info@protoa.digital` (general).

## Working rules

- **i18n is mandatory**: any user-facing text change must update BOTH `ja.json` AND `en.json`. Never hardcode Japanese or English strings in components.
- **Mobile-first**: always verify mobile layout. Use `sm:` breakpoint prefixes for desktop overrides.
- **Don't over-engineer**: make minimal changes. No extra features, helpers, or abstractions beyond what's asked.
- **Don't add comments** unless the logic isn't self-evident.
- **Server actions go in `lib/actions/`** with a matching file name (e.g., `contact.ts`).
- **Form validation**: use Zod schemas inside server actions.
- **Don't create `.md` docs** unless explicitly requested.

## Communication style

- Be terse. Skip preamble and trailing summaries.
- No emojis unless asked.
- Use markdown file links like [CLAUDE.md](CLAUDE.md), not backticks.
- Ask before making architectural changes or large refactors.
- For destructive/irreversible actions (force push, delete files, drop DB), confirm first.

## Before committing

- Run `npm run lint` if there are code changes
- Check both `/ja` and `/en` pages if text or layout changed
- Check mobile view (narrow viewport) for layout changes
- Never commit `.env*` or secrets

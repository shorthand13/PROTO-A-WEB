# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server at localhost:3000
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

No test framework is configured.

## Architecture

This is a **Next.js 16 App Router** project using React 19, TypeScript (strict mode), and Tailwind CSS v4.

- `app/` — App Router pages and layouts. `layout.tsx` is the root layout; `page.tsx` is the home route.
- `public/` — Static assets served at the root URL.
- Path alias `@/` maps to the project root.

**Tailwind CSS v4** uses the new CSS-first approach: styles are imported via `@import "tailwindcss"` in `app/globals.css` rather than a `tailwind.config.js` file. Theme customization is done through CSS variables in `globals.css`.

Dark mode is handled via CSS `prefers-color-scheme` media queries, not Tailwind's `darkMode` config option.

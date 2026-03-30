# Asset Guard Frontend — CLAUDE.md

## Project Overview

Admin dashboard for managing organizational assets, built with Next.js App Router, TypeScript, and Tailwind CSS v4.

---

## Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run start    # Run production server
npm run lint     # ESLint
npx tsc --noEmit # Type check only
```

---

## Architecture

### Stack
- **Next.js** (App Router, Server Components by default)
- **React 19** + **TypeScript** (strict mode)
- **Tailwind CSS v4** with CSS variable theme system
- **Material Symbols Outlined** icons (Google Fonts)

### Route Structure
```
app/
├── page.tsx                 # Root redirect (/ → /login or /dashboard)
├── login/                   # Public auth page
├── api/auth/                # API routes (backend proxy for auth)
└── (admin)/                 # Protected route group
    ├── layout.tsx           # Auth guard + sidebar
    ├── dashboard/
    ├── assets/
    └── staff/
```

`_components/` folders inside routes contain private components (not routable).

---

## Authentication

- **Cookie-based** with `httpOnly` flag: `access_token`, `refresh_token`, `user_role`
- `middleware.ts` protects admin routes, redirects unauthenticated users to `/login`
- `app/api/auth/login/route.ts` proxies login to the backend and sets cookies
- Server Components access cookies via `next/headers`

---

## API Integration

**Backend URL** — configured in `lib/config.ts`:
- `getBaseUrl()` — server-side (reads `BASE_URL`)
- `buildApiUrl()` — builds backend endpoint URLs from `BASE_URL`
- No hardcoded fallback; the app fails clearly if `BASE_URL` is missing

**Server Component fetch pattern:**
```typescript
const response = await fetch(buildApiUrl("/admin/some-endpoint"), {
  headers: { Authorization: `Bearer ${accessToken}` },
  cache: "no-store",
});
```

**Client Component fetch pattern:**
```typescript
const response = await fetch("/api/some-route", {
  method: "POST",
  credentials: "include",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});
```

**API Response shape:**
```typescript
{ success: boolean, data: T, error: { messages: string[] }, meta: { timestamp: string } }
```

Always check `response.ok` AND `responseData.success`.

---

## State Management

- No Redux/Zustand — use React hooks and Server Components
- Form state pattern:
```typescript
type SubmissionState = { status: "idle" | "success" | "error"; message: string };
```
- Server Components fetch and pass data as props; client components handle interactivity only

---

## Styling

**Theme** — CSS variables defined in `app/globals.css`:
- `--text-strong`, `--text-muted`, `--surface`, `--surface-muted`, `--border`
- Primary color: `#1152d4`
- Apply via Tailwind: `className="text-[var(--text-strong)]"`

**Component patterns:**
- Cards: `rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-sm`
- Icons: `<span className="material-symbols-outlined text-lg">icon_name</span>`
- Grid layouts: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`
- Sidebar width: `w-64` (fixed)
- Content max width: `max-w-[1200px] mx-auto`

---

## Key Conventions

- **Server Components by default** — add `"use client"` only when needed (event handlers, hooks)
- **Path alias**: `@/*` maps to project root (`import { foo } from "@/lib/config"`)
- Normalize API data in Server Components before passing to Client Components
- Use `toSafeNumber()` / `toSafePercentage()` helpers for numeric API values
- Accessibility: include `aria-label`, `aria-live`, `aria-current` where relevant
- Semantic HTML: `<form>`, `<header>`, `<main>`, `<nav>`

---

## Environment Variables

```env
BASE_URL= # Backend URL used by server-side fetches and API proxy routes
```

Use `.env` for local development and set `BASE_URL` in production for deployed environments.

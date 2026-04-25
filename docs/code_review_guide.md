# ClipFlow Code Review Guide

This guide provides a structured approach to reviewing the **ClipFlow** platform codebase. It covers both the frontend (Next.js) and the "backend" (API Routes, Server Actions, and Database).

---

## 1. Project Architecture Overview

ClipFlow is built as a unified Next.js application, where the backend logic is integrated via Server Components, Server Actions, and API Routes.

- **Frontend**: Next.js 15+ (App Router), React 19, Tailwind CSS + DaisyUI.
- **Backend/API**: Next.js API Routes (located in `app/api/`) and Server Actions.
- **Database**: PostgreSQL (Neon Serverless) with **Drizzle ORM**.
- **Authentication**: Clerk (clerk.com).
- **Storage**: Cloudflare R2 (S3-compatible) for video and thumbnail storage.
- **External Integrations**: Google Drive API (File Picker), YouTube Data API (Publishing).

---

## 2. Backend Review Checklist (`app/api` & `lib/db`)

### 🔐 Authentication & Security
- [ ] **Clerk Middleware**: Verify that `proxy.ts` (or `middleware.ts`) correctly protects private routes.
- [ ] **User Context**: Check that API routes use `auth()` from `@clerk/nextjs` to identify the user.
- [ ] **Database Identity**: Ensure `clerkId` is mapped to the internal `users.id` before performing DB operations.

### 🗄️ Database Logic (`lib/db/schema.ts`)
- [ ] **Schema Integrity**: Review relationships (e.g., `projects -> users`, `project_files -> projects`).
- [ ] **Migrations**: Check the `drizzle/` folder for pending migrations.
- [ ] **Type Safety**: Ensure Drizzle schemas are used for all queries to maintain TypeScript safety.

### 🚀 API Endpoints (`app/api/*`)
- [ ] **Error Handling**: Are `try/catch` blocks implemented with appropriate HTTP status codes (400, 401, 403, 500)?
- [ ] **Validation**: Are input parameters validated before processing?
- [ ] **Rate Limiting**: (Future) Consider if sensitive routes need rate limiting.

### 📦 Storage & Third-Party
- [ ] **R2 Keys**: Ensure storage keys (S3 keys) are generated securely and not leaked.
- [ ] **OAuth Scopes**: Check if YouTube and Google Drive tokens are handled securely in `youtubeChannels` and `googleDriveConnections`.

---

## 3. Frontend Review Checklist (`app/` & `components/`)

### 🎨 Design & UI (`components/`, `globals.css`, `ui.css`)
- [ ] **Design Tokens**: Verify that components use the established design tokens (CSS variables like `--ui-bg`, `--ui-fg`, `--ui-accent`).
- [ ] **Theme Support**: Check `ThemeSwitcher.tsx` and ensure components respond to `data-theme="clipflow"`.
- [ ] **Responsiveness**: Test layouts (`DashboardLayout.tsx`) on mobile and desktop breakpoints.

### 🏗️ Component Structure
- [ ] **Server vs. Client**: Ensure components are correctly designated (`'use client'`) only when interactivity is needed.
- [ ] **Prop Safety**: Verify interfaces for components like `Badge.tsx`, `Button.tsx`, and `ProjectCard.tsx`.
- [ ] **Performance**: Look for unnecessary re-renders in client components.

### 🧭 Routing & Navigation
- [ ] **App Router Paths**: Check folder structure in `app/` for logical routing (e.g., `(dashboard)/projects/[id]`).
- [ ] **Loading/Error States**: Are `loading.tsx` and `error.tsx` files present for a smooth UX?

### 📈 SEO & Meta
- [ ] **Metadata**: Review `layout.tsx` and page-level `generateMetadata` functions.
- [ ] **Semantic HTML**: Ensure proper use of `<h1>`, `<main>`, `<nav>`, etc.

---

## 4. Key Files to Inspect

| File/Directory | Description |
| :--- | :--- |
| `app/layout.tsx` | Root layout, fonts, and global providers. |
| `lib/db/schema.ts` | The "Source of Truth" for the database structure. |
| `proxy.ts` | The security gatekeeper (Middleware). |
| `app/api/upload/route.ts` | Core logic for handling file uploads to R2. |
| `components/UploadZone.tsx` | Main interactive component for file selection. |
| `package.json` | Dependencies and available scripts (`db:push`, `dev`, etc.). |

---

## 5. Running the Review

To validate the code locally:
1. **Linting**: `npm run lint`
2. **Type Checking**: `npx tsc --noEmit`
3. **DB Sync**: `npm run db:generate` to check for schema discrepancies.
4. **Dev Server**: `npm run dev` and navigate the dashboard as both a "Creator" and an "Editor".

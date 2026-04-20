# ClipFlow Technical Architecture Review

This document outlines how **Clerk**, **Drizzle ORM**, and **Next.js** are integrated to create the "Content Firewall."

---

## 🔐 1. Authentication (Clerk)
We use Clerk for identity management because of its high security and native support for Next.js 15/16.

- **Root Provider**: In `app/layout.tsx`, the `<ClerkProvider>` wraps the entire application. We've opted into dynamic rendering and used `<Suspense>` to ensure the auth check doesn't block the initial page load.
- **Middleware Protection**: `middleware.ts` uses `clerkMiddleware` to protect all routes except the landing page and auth pages. It uses the asynchronous `await auth.protect()` pattern.
- **Catch-all Routes**: We moved `sign-in` and `sign-up` to `[[...rest]]` folders to support Clerk's complex redirected flows.

## 🗄️ 2. Database & ORM (Drizzle + Neon)
We use **Neon PostgreSQL** (serverless) and **Drizzle ORM** for a lightweight, type-safe backend.

- **The Schema**: Located in `lib/db/schema.ts`. It's designed for a **Project-File model**:
    - `users`: Stores the `clerkId` alongside our own metadata.
    - `projects`: Contains YouTube metadata (tags, visibility) and belongs to a Creator.
    - `project_files`: Supports multiple versions (Raw, Draft, Final) and approval statuses.
    - `thumbnails`: Supports A/B testing variations.
- **The Connection**: `lib/db/index.ts` uses the `@neondatabase/serverless` HTTP driver, which is optimized for Vercel's Edge/Serverless functions.
- **Synchronization**: `lib/user-sync.ts` contains the `syncUser()` helper. This is the **bridge**:
    1. It gets the current user from Clerk.
    2. It checks if that User ID (`clerkId`) exists in our Neon DB.
    3. If not, it creates a new record.
    4. It returns the full DB object, allowing us to access custom fields like `role` or `name` throughout the app.

## 🔄 3. Data Flow Diagram
```mermaid
sequenceDiagram
    User->>Dashboard: Navigates to /dashboard
    Dashboard-->>Middleware: Clerk checks session
    Middleware-->>Dashboard: Allow access
    Dashboard->>syncUser(): Request DB Profile
    syncUser()->>Clerk API: Get currentUser()
    syncUser()->>Neon DB: Select * FROM users WHERE clerk_id = ID
    Note right of syncUser(): If missing, INSERT into users
    Neon DB-->>Dashboard: Return user { id, role, email }
    Dashboard-->>User: Render "Welcome back, [Name]"
```

## 🛠️ 4. Current File Map
- **Layout**: `app/layout.tsx` (Dynamic Shell + Clerk)
- **Security**: `middleware.ts` (Route access control)
- **DB Core**: `lib/db/schema.ts` (Architecture) & `lib/db/index.ts` (Connection)
- **Logic**: `lib/user-sync.ts` (The Auth-to-DB bridge)
- **Page**: `app/page.tsx` (Lofi Landing Page)
- **Page**: `app/dashboard/page.tsx` (Secure Creator Interface)

---

### 🚀 Status: Phase 2 Complete
The foundation is solid. Every login is now tracked in your own database, and the "Content Firewall" schema is fully prepared for multi-file workflows.

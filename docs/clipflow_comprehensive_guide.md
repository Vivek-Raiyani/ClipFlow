# 🖋️ ClipFlow: Comprehensive Technical Guide

Welcome to the **ClipFlow** documentation. This guide explains how the system is built, how to maintain it, and how to scale it within the free-tier limits of our modern stack.

---

## 🏗️ 1. System Architecture
ClipFlow is a "Serverless Video Workspace" built on the **Next.js App Router**. It follows the **Zero-Egress Firewall** philosophy: video files move directly from the editor's browser to Cloudflare R2, and then from R2 to YouTube. At no point does your expensive server handle the massive video binary data.

### 🧩 The Tech Stack
- **Frontend/API**: Next.js 16 (React 19).
- **Authentication**: Clerk (Identity as a Service).
- **Database**: Neon PostgreSQL (Serverless Postgres).
- **ORM**: Drizzle ORM (Type-safe SQL).
- **Storage**: Cloudflare R2 (S3-Compatible, $0 Egress).

---

## 🔑 2. Credentials & Setup Guide

### 🛡️ Clerk (Auth)
1.  Go to [Clerk Dashboard](https://dashboard.clerk.com/).
2.  Create a "Standard" application.
3.  Go to **API Keys** and copy the Publishable and Secret keys.
4.  **Important**: Under "Paths", ensure your Sign-In and Sign-Up paths match our catch-all structure (`/sign-in` and `/sign-up`).

### ☁️ Neon (Database)
1.  Log in to [Neon.tech](https://neon.tech/).
2.  Create a new project named "ClipFlow".
3.  Copy the **Connection String** (ensure it has `?sslmode=require`).
4.  Run `npx drizzle-kit push` locally to sync the schema.

### 📦 Cloudflare R2 (Storage)
1.  Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) > R2.
2.  Create a bucket (e.g., `clipflow-assets`).
3.  Go to **Manage R2 API Tokens**.
4.  Create a new token with **Edit** permissions.
5.  Copy the **Access Key ID**, **Secret Access Key**, and the **Account ID** (found in the URL or the R2 settings page).

### 📺 YouTube (Publishing Bridge)
1.  Go to [Google Cloud Console](https://console.cloud.google.com/).
2.  Enable the **YouTube Data API v3**.
3.  Create **OAuth 2.0 Client ID** (Web Application).
4.  Set Authorized Redirect URIs to: `http://localhost:3000/api/auth/youtube/callback`.
5.  Copy the **Client ID** and **Client Secret**.

---

## 🏛️ 3. Code Structure & File Map

### `/app` (The Routing Engine)
- `dashboard/page.tsx`: The main creator hub. Triggers `syncUser()`.
- `dashboard/projects/[id]/page.tsx`: The Project Workspace where uploads and approvals happen.
- `api/upload/presigned-url/`: Generates time-limited upload links for security.
- `api/upload/finalize/`: Records file metadata into Postgres after successful R2 upload.
- `api/files/[id]/status/`: Handles Creator "Approve/Reject" actions.

### `/lib` (The Core Logic)
- `db/schema.ts`: The source of truth for our PostgreSQL architecture.
- `user-sync.ts`: Specifically handles bridging Clerk's identity to our Neon database.
- `r2.ts`: Initializes the S3 client for Cloudflare.

### `/components` (The UI Shell)
- `UploadZone.tsx`: Handles the complex 3-step secure upload logic.
- `FileActions.tsx`: Small interactive buttons for creator approvals.

---

## 📊 4. Platform Limits (Free Tiers)

| Platform | Limit Category | Free Tier Capacity |
| :--- | :--- | :--- |
| **Clerk** | Users | 10,000 Monthly Active Users (MAUs) |
| **Neon** | Storage | 512MB (Plenty for metadata; videos are in R2) |
| | Compute | 0.25 vCPU (Suspends when inactive to save cost) |
| **Cloudflare R2** | Storage | 10 GB |
| | Operations | 1M Class A (Upload), 10M Class B (Download) |
| | Egress | **$0.00** (Unlimited transfers to YouTube) |
| **YouTube API** | Quota | 10,000 units/day (~5-10 video uploads per day) |

---

## 🔄 5. The "Firewall" Data Flow
1.  **Editor** selects a file in `UploadZone`.
2.  **Next.js API** generates a `signedUrl` from Cloudflare.
3.  **Editor's Browser** PUSHES the file directly to R2 using that URL.
4.  **Next.js API** records the R2 `key` in Postgres as a "Pending" version.
5.  **Creator** reviews the file and marks it "Approved".
6.  **ClipFlow** uses the R2 key to stream the file to YouTube (Phase 4).

---

### 🚀 Development Status
We have completed **Phases 1-3**. The system is ready for **Phase 4: YouTube OAuth and Publishing**.

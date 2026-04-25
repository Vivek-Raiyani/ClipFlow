# ClipFlow Complement Implementation Guide

## 1. End-to-End Pipeline Overview
ClipFlow serves as a collaborative hub for video creators and editors to manage, review, and ultimately publish content directly to YouTube. Here's how the pipeline operates from start to finish:
1. **Onboarding & Auth**: Users sign in via Clerk. The `syncUser` logic ensures that Clerk profiles are mapped into the Postgres Database.
2. **Integration Linking**: Creators link their Google Drive and YouTube accounts. The access and refresh tokens are securely stored in the PostgreSQL database.
3. **Team Building**: Creators invite editors. Editors are linked securely to the creator under a `creatorEditorRelationships` structure.
4. **Project Creation & Asset Ingestion**: The Creator creates a Project. Files are ingested either by Direct Upload (Editor side) or Drive Import (Creator side).
5. **Approval Workflow**: Files are versioned in `projectFiles` and tracked in `auditLogs`. Once a file is approved by the Creator, its status changes to `approved`.
6. **Publishing**: The Creator clicks publish. The backend fetches the approved file from Cloudflare R2 and publishes it directly to YouTube using the stored `refreshToken` from the `youtubeChannels` table, mapping the project tags and description.

## 2. Component Implementations

### Authentication Mechanism
**Stack**: Clerk + Neon PostgreSQL + Drizzle ORM
- User authentication is heavily managed by Clerk, which handles sign-ins, sessions, and active session tokens.
- **The Sync layer (`lib/user-sync.ts`)**: Because the platform needs hard database relations (foreign keys from files, projects, and relationships to a specific user), every time a user signs in, a `syncUser` function checks if the `clerk_id` exists in the `users` table. If not, it creates a database row for the user. 
- This dual-layer approach provides robust UI authentication while maintaining database integrity for permissions, roles, and integration tokens (like YouTube and Drive OAuth tokens).

### How Editors Are Added & Access Granted
**File**: `app/api/team/invite/route.ts` & `lib/db/schema.ts`
- **Addition**: A creator inputs an editor's email. The backend checks if the editor already exists.
  - If they do, it immediately creates a `creatorEditorRelationships` row, linking them securely to the creator.
  - If they don't, it creates a pending `invitations` row and sends an email via `Nodemailer` containing an invite link.
- **Access Verification**: Access to projects isn't just about sharing a link. The `creatorEditorRelationships` table acts as a permission boundary. Since the database knows who is mapped to who, API routes conditionally yield data ensuring the requesting user either owns the project (creator) or is actively linked as an editor to the creator who owns the project.

### Google Drive Server-to-Server Import
**File**: `app/api/drive/import/route.ts`
- **How it works**: Instead of downloading the file from Drive to the user's laptop and then uploading it to R2, ClipFlow does a true Server-to-Server transfer.
- The user passes a Drive `fileId`. The backend retrieves the Creator's `driveRefreshToken` from the database.
- The `googleapis` client connects to Google Drive and requests the file as a continuous `stream` (`responseType: "stream"`).
- Almost immediately, this readable stream is piped directly into Cloudflare R2 using the `@aws-sdk/lib-storage` `Upload` manager.
- **Benefit**: Zero memory pressure on the client. Extremely high-speed data transfer since the backend bandwidth runs efficiently between Google Data Centers and Cloudflare bypassing local ISP speeds.

### R2 Direct File Uploads
**Files**: `app/api/upload/presigned-url/route.ts`, `app/api/upload/finalize/route.ts`
- **How it works**: For an editor wanting to upload a final render from their local machine, tunneling gigabytes through the Next.js server destroys performance and violates server timeouts.
- **Pre-signed URLs**: The Next.js API generates a time-limited (60-minute) restricted "ticket" (Pre-signed URL) via the AWS S3 SDK based on the file name and size.
- **Client Upload**: The user's browser takes this URL and executes a PUT request, throwing the file *directly* into the Cloudflare R2 bucket.
- **Finalization**: Once standard upload succeeds, the client pings the `/finalize` route, which writes the file record into the Postgres `projectFiles` table (incrementing the file version tracking automatically based on preexisting files in the project) and logs an event in `auditLogs`.

---

## 3. Cost & Rate Limit Implications

When scaling this application, be aware of the following external constraints and pricing models:

### 1. Cloudflare R2 (Storage & Egress)
- **Cost**: Extremely cost-effective. **$0 for egress** (bandwidth). Storage is free for the first 10GB/month (then $0.015/GB-month). Class A Operations (Uploads) are 1 million/month free, then $4.50/million.
- **Rate Limit**: Highly scalable, minimal concerns for rate-limiting.

### 2. Google Drive API (Ingestion)
- **Cost**: Free to use the API itself. (The storage footprint counts against the user's own Google Drive quota).
- **Rate Limit**: 20,000 queries per 100 seconds per project, and 20,000 per 100 seconds per user. Downloading heavy media is highly data-intensive, so massive concurrent downloads could be momentarily throttled. 

### 3. YouTube Data API v3 (Publishing)
- **Cost**: Free to use, but heavy quota systems are enforced.
- **Rate Limit**: Projects start with **10,000 quota units per day**.
  - General listing costs 1 unit.
  - **Uploading a single video costs 1,600 units.**
  - **Daily Limit Insight**: You are strictly capped at ~6 video uploads per day across the entire application on the default free tier. An immediate request for a Google Cloud Quota Increase is heavily advised for a production launch.

### 4. Hosting Constraints (Vercel / Next.js)
- **Cost**: Depends strongly on your Host (e.g. Vercel). Serverless functions are charged by execution time and RAM.
- **Rate Limit (Timeouts)**: **This is your biggest technical risk.**
  - Vercel Hobby cuts off serverless execution at 10 seconds.
  - Vercel Pro cuts off at 300 seconds (5 minutes). 
- **Danger Zone**: While "R2 Direct Upload" from the client successfully dodges timeout constraints, the **Server-to-Server Drive Import** and the **YouTube direct publishing buffer route** use Next.js serverless functions. If importing a massive 20GB ProRes file from Google Drive takes longer than 5 minutes to stream, Vercel will aggressively kill the function halfway, resulting in a corrupted partial file upload. To handle true 4K hour-long media, you'll want to offload `publish` and `import` routes to a long-running background worker framework (like Trigger.dev or a dedicated instance).

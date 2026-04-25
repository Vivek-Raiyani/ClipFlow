# ClipFlow: End-to-End User Testing Guide

This guide outlines exactly how to manually test your application from start to finish, ensuring every piece of the pipeline (Clerk → Neon → Drive → R2 → YouTube) is fully functional.

---

## Pre-Flight Checklist
Before you begin testing in the browser, ensure these backend prerequisites are complete:
1. [ ] **`.env` is populated**: You have filled out all variables copied from `.env.example`.
2. [ ] **Database Synced**: You have run `npx drizzle-kit push` to create the tables in Neon Postgres.
3. [ ] **Google Cloud URIs**: You have added `http://localhost:3000/api/auth/youtube/callback` and `http://localhost:3000/api/auth/drive/callback` to your Google Cloud OAuth "Authorized redirect URIs".
4. [ ] **App is Running**: You have started your server with `npm run dev`.

---

## Phase 1: Authentication & Onboarding
**Goal:** Verify Clerk user creation and Database Syncing.

1. Navigate to `http://localhost:3000`.
2. Click the **"Get Started"** or **"Dashboard"** button.
3. You will be redirected to the Clerk Sign-In/Sign-Up page. Create a fresh account or log in with Google.
4. You should be redirected to `/dashboard`. 
   * **Success Metric:** Check your Neon database via their web interface. You should see a new row in the `users` table corresponding to your email.

---

## Phase 2: Connecting External Platforms
**Goal:** Verify Google OAuth scopes and token capture.

1. On the Dashboard, locate the **"Connect YouTube"** button.
2. Click it. Google will ask for permission to manage your YouTube videos. Approve it.
3. You should be redirected back to the Dashboard. The "Connect YouTube" button should disappear.
4. Locate the **"Connect Drive"** button.
5. Click it. Google will ask for full Google Drive permissions. Approve it.
6. You should be redirected back to the Dashboard. The "Connect Drive" button should disappear.
   * **Success Metric:** Check your Neon database. `youtube_channels` and `google_drive_connections` tables should now have rows with populated tokens linked to your user ID.

---

## Phase 3: Project Creation
**Goal:** Verify database insertion for new content pipelines.

1. On the Dashboard, click the **"Create Project"** button.
2. Enter a test Title (e.g., `"My First SaaS VLOG"`), Description, and set visibility to `"Private"`.
3. Click "Create".
4. You should be redirected to `/dashboard/projects/[your-new-project-id]`.
   * **Success Metric:** The page loads without a 404 error, and you see the Upload Zone.

---

## Phase 4: The Upload Pipelines (Two Methods)

### Method A: Local File Upload (The Editor Experience)
**Goal:** Verify direct browser-to-R2 presigned URL streaming.

1. In the project view, select **"draft"** from the file type tabs.
2. Click the **"Beam Data to R2"** box to select a local small `.mp4` video (under 50MB for testing), or drag-and-drop one inside.
3. The UI should display an "Encrypting Node..." progress spinner. Wait for it to hit 100%.
4. The page will auto-refresh. Check the file list to see your item marked as "Pending Review".
   * **Success Metric:** Go to your Cloudflare R2 dashboard online. Look inside your bucket. The file should be sitting there.

### Method B: Google Drive Import (The Creator Experience)
**Goal:** Verify server-to-server streaming from Google Drive into R2.

1. Below the upload box, click the blue **"Import from Google Drive"** button.
2. A sleek dark-mode modal should appear. It will say "Scanning Drive..." for a second, then display a list of all your `.mp4`/video files in your Google Drive (along with thumbnails).
3. Find a small test video and click **"Import"**.
4. The modal will close, the main progress spinner will engage, and your backend will stream the file directly out of Drive and into R2.
5. The page will auto-refresh, and the new file will appear in the UI list.
   * **Success Metric:** Check your Neon Database `project_files` table. Both files should have entries.

---

## Phase 5: The Content Firewall (Publishing)
**Goal:** Verify server-to-server streaming from Cloudflare R2 straight into YouTube.

1. In your project dashboard, find one of the uploaded files in the list.
2. Click the **"Review & Push"** (or Approve) button next to the file.
3. Wait exactly 5–20 seconds (depending on file size). Your backend is piping the bytes from R2 directly into YouTube's API.
4. The UI should update to show **"Published"** and display a YouTube icon/link.
   * **Success Metric:** Go to `studio.youtube.com`. Look at your content list. The video should appear there with the exact title and description you provided in Phase 3, securely published as "Private".

---

## 🛑 Troubleshooting Guide (If a Step Fails)
* **Auth Failing:** If Google returns a `redirect_uri_mismatch` error, your `localhost:3000/...` URI isn't exactly matched in your Google Cloud OAuth settings.
* **Upload Returns 403 or Fails:** Your Cloudflare R2 CORS settings might not be established. Make sure your R2 Bucket is configured to allow `PUT` requests from `http://localhost:3000`.
* **Drive API Fails:** Ensure the "Google Drive API" is actually toggled ON in your Google Cloud Console library.
* **YouTube Publish Fails:** Ensure the "YouTube Data API v3" is toggled ON in your Google Cloud console library. Ensure the file wasn't 0 bytes.

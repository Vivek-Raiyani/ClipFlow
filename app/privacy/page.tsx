import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy - ClipFlow",
  description: "Privacy Policy for ClipFlow - The Content Firewall.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-text-secondary hover:text-text-primary mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        
        <h1 className="text-4xl font-extrabold tracking-tight mb-8 font-inter">Privacy Policy</h1>
        
        <div className="space-y-8 text-base text-text-secondary leading-relaxed">
          <section>
            <p className="mb-4">Last updated: April 2026</p>
            <p>
              Welcome to ClipFlow ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and share your information when you use our website and services, specifically detailing our integration with Google Cloud Platform and YouTube API Services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">1. Information We Collect</h2>
            <p className="mb-4">
              When you use ClipFlow to manage your video workflow and publish to YouTube, we collect the following types of information:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account Information:</strong> Name, email address, and profile picture provided via Clerk authentication or Google Sign-In.</li>
              <li><strong>Google & YouTube Data:</strong> With your explicit consent via Google OAuth, we access your Google Drive (to import video files) and your YouTube account (to publish videos on your behalf).</li>
              <li><strong>Video Content:</strong> Video files and metadata (titles, descriptions, tags) that you upload to our platform (stored securely in Cloudflare R2).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">2. How We Use Your Information</h2>
            <p className="mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, operate, and maintain the ClipFlow platform.</li>
              <li>Facilitate the transfer of video files from Google Drive to our secure storage.</li>
              <li>Publish approved video files directly to your authenticated YouTube channel.</li>
              <li>Send administrative information, such as updates, security alerts, and support messages.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">3. Google API Services Usage Disclosure</h2>
            <p className="mb-4">
              ClipFlow's use and transfer of information received from Google APIs to any other app will adhere to the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">Google API Services User Data Policy</a>, including the Limited Use requirements.
            </p>
            <p className="mb-4">
              <strong>We do not use Google Workspace APIs to develop, improve, or train generalized AI and/or ML models.</strong>
            </p>
            <p>
              You can revoke ClipFlow's access to your Google account at any time by visiting your <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">Google Account Security Settings</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">4. Data Security & Storage</h2>
            <p>
              We implement industry-standard security measures to protect your data. Video files are stored in secure, zero-egress cloud storage (Cloudflare R2), and database records are hosted on secure infrastructure (Neon). We do not sell your personal data or video content to any third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">5. Contact Us</h2>
            <p>
              If you have any questions or concerns about this Privacy Policy, please contact us at support@clipflow.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms of Service - ClipFlow",
  description: "Terms of Service for ClipFlow - The Content Firewall.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-text-secondary hover:text-text-primary mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        
        <h1 className="text-4xl font-extrabold tracking-tight mb-8 font-inter">Terms of Service</h1>
        
        <div className="space-y-8 text-base text-text-secondary leading-relaxed">
          <section>
            <p className="mb-4">Last updated: April 2026</p>
            <p>
              Welcome to ClipFlow. These Terms of Service ("Terms") govern your use of the ClipFlow website, platform, and related services (collectively, the "Service"). By accessing or using our Service, you agree to be bound by these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">1. Description of Service</h2>
            <p>
              ClipFlow acts as a "Content Firewall," providing a platform for YouTube creators and video editors to securely upload, review, manage, and publish video files directly to YouTube without sharing channel credentials.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">2. Account Registration and Security</h2>
            <p className="mb-4">
              To use certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate.
            </p>
            <p>
              You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. ClipFlow cannot and will not be liable for any loss or damage arising from your failure to comply with the above.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">3. Third-Party Services (Google & YouTube)</h2>
            <p className="mb-4">
              Our Service integrates with third-party platforms, specifically Google Drive and YouTube. By connecting your Google account, you grant us permission to access your Google Drive files (for importing) and YouTube channel (for publishing) strictly in accordance with your explicit actions within the platform.
            </p>
            <p>
              Your use of the YouTube integration is also bound by the <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">YouTube Terms of Service</a>. By using ClipFlow, you agree to be bound by the YouTube Terms of Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">4. Acceptable Use Policy</h2>
            <p className="mb-4">
              You agree not to use the Service to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Upload, post, or transmit any video content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable.</li>
              <li>Violate any applicable local, state, national, or international law or regulation.</li>
              <li>Infringe upon the intellectual property rights of others.</li>
              <li>Attempt to gain unauthorized access to our Service, other user accounts, or computer systems connected to the Service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">5. Intellectual Property</h2>
            <p>
              You retain all ownership rights to the video content you upload to ClipFlow. We claim no intellectual property rights over your material. By uploading content, you grant us a temporary, limited license solely to store, process, and transmit the content to YouTube on your behalf.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">6. Termination</h2>
            <p>
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">7. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at support@clipflow.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

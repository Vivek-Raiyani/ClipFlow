import React from "react";
import Link from "next/link";
import { ArrowLeft, Mail, MessageSquare } from "lucide-react";

export const metadata = {
  title: "Contact Us - ClipFlow",
  description: "Get in touch with the ClipFlow team.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-text-secondary hover:text-text-primary mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        
        <h1 className="text-4xl font-extrabold tracking-tight mb-8 font-inter">Contact Us</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="p-6 bg-white border border-ui-border rounded-2xl">
            <div className="w-10 h-10 bg-ui-fg4 rounded-xl flex items-center justify-center mb-4">
              <Mail className="w-5 h-5 text-ui-fg" />
            </div>
            <h3 className="text-lg font-bold mb-2 font-inter">Email Support</h3>
            <p className="text-text-secondary text-sm mb-4">
              For technical issues, account questions, or feedback.
            </p>
            <a href="mailto:support@clipflow.com" className="text-brand-primary font-mono text-xs uppercase tracking-widest font-bold hover:underline">
              support@clipflow.com
            </a>
          </div>

          <div className="p-6 bg-white border border-ui-border rounded-2xl">
            {/* <div className="w-10 h-10 bg-ui-fg4 rounded-xl flex items-center justify-center mb-4">
              <Twitter className="w-5 h-5 text-ui-fg" />
            </div> */}
            <h3 className="text-lg font-bold mb-2 font-inter">Twitter / X</h3>
            <p className="text-text-secondary text-sm mb-4">
              Follow us for updates or DM for quick queries.
            </p>
            <a href="https://twitter.com/clipflow" target="_blank" rel="noopener noreferrer" className="text-brand-primary font-mono text-xs uppercase tracking-widest font-bold hover:underline">
              @clipflow
            </a>
          </div>
        </div>

        <div className="p-8 bg-ui-fg text-ui-bg rounded-3xl">
          <h2 className="text-2xl font-bold mb-4 font-inter italic">Need a custom workflow?</h2>
          <p className="text-ui-bg opacity-80 mb-6 leading-relaxed">
            If you're a production agency or a large-scale creator needing specific integrations, let's talk about an enterprise plan tailored to your volume.
          </p>
          <a href="mailto:sales@clipflow.com" className="inline-flex items-center gap-2 px-6 py-3 bg-ui-bg text-ui-fg rounded-full font-mono text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity">
            <MessageSquare className="w-4 h-4" />
            Contact Sales
          </a>
        </div>
      </div>
    </div>
  );
}

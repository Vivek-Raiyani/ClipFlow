import type { Metadata } from "next";
import { Inter, Playfair_Display, Space_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "ClipFlow | The Secure Content Firewall for Creators",
  description: "Secure your YouTube channel by decoupling editor access. Fast, server-to-server video workflow with zero egress fees using Cloudflare R2.",
  keywords: ["YouTube Workflow", "Content Firewall", "Video Production", "Cloudflare R2", "Creator Security"],
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} ${playfair.variable} ${spaceMono.variable}`}>
        <body className="antialiased">
          <div className="lofi-grain"></div>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
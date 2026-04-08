import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/app/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Job Skills Analyzer — Discover What Any Role Requires",
  description:
    "Type any job title and instantly get a structured breakdown of the skills, tools, and certifications required in today's job market — powered by Google Gemini AI.",
  keywords: [
    "job skills",
    "career requirements",
    "skills analyzer",
    "AI job analysis",
    "certifications",
    "tech stack",
  ],
  openGraph: {
    title: "Job Skills Analyzer",
    description:
      "Discover the skills, tools, and certifications required for any job role — instantly.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning is required by next-themes:
    // it prevents React from warning about the `class` attribute
    // being set on <html> before hydration completes.
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

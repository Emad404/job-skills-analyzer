import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/app/providers";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  weight: ["400", "500", "600", "700"],
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${plusJakartaSans.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

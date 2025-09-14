import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import AuthProvider from "@/components/auth/AuthProvider";
import ClientThemeProvider from "@/components/providers/ClientThemeProvider";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import {
  generateWebsiteStructuredData,
  generateOrganizationStructuredData,
} from "@/lib/structured-data";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = generateSEOMetadata({
  title: "NextJS Blog - Modern Development Insights",
  description:
    "Professional blog covering modern web development with Next.js, TypeScript, React, and cutting-edge technologies. Expert tutorials, guides, and insights for developers.",
  keywords: [
    "nextjs",
    "blog",
    "typescript",
    "prisma",
    "tailwindcss",
    "react",
    "web development",
    "full-stack",
    "javascript",
    "programming",
    "tutorials",
    "modern web development",
    "app router",
    "server components",
    "authentication",
    "database",
    "deployment",
    "performance",
    "seo",
    "best practices",
    "portfolio",
  ],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteStructuredData = generateWebsiteStructuredData();
  const organizationStructuredData = generateOrganizationStructuredData();

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteStructuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationStructuredData),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ClientThemeProvider>
      </body>
    </html>
  );
}

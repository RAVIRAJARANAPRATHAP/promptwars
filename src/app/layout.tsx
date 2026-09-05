import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ProjectSpark — AI Project Ideas for Final-Year Students",
  description:
    "Generate tailored final-year project ideas and get a complete development roadmap powered by AI. Built for engineering and CS students.",
  keywords: ["project ideas", "final year project", "AI", "student projects", "CS", "engineering"],
  openGraph: {
    title: "ProjectSpark",
    description: "AI-powered project ideas and roadmaps for final-year students",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <a href="#main-content" className="sr-only sr-only-focusable">
          Skip to main content
        </a>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

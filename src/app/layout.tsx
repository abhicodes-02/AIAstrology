import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { CosmicBackground } from "@/components/CosmicBackground";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });

export const metadata: Metadata = {
  title: "AI Astrology | Discover Your Stars",
  description: "AI-powered Vedic Kundli readings and insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${space.variable} antialiased h-full`}>
      <body className="min-h-full flex flex-col bg-background text-foreground overflow-x-hidden font-sans">
        <CosmicBackground />
        {children}
      </body>
    </html>
  );
}

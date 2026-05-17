import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { ThemeEditor } from "@/components/dev/ThemeEditor";
import { FontEditor } from "@/components/dev/FontEditor";
import { TypewriterEditor } from "@/components/dev/TypewriterEditor";
import { GravityCursor } from "@/components/ui/GravityCursor";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300","400","600","700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jalil Evans | Senior Product Designer",
  description:
    "Senior Product Designer with 4+ years at Meta. I find 0→1 bets, build the proof, and take ideas from a one-line pitch to a funded workstream. Looking for an early team where design shapes what gets built.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} antialiased`}>
      <body className="min-h-screen flex flex-col bg-canvas text-ink">
        <GravityCursor />
        <SmoothScroll>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          {process.env.NODE_ENV === "development" && (
            <>
              <FontEditor />
              <ThemeEditor />
              <TypewriterEditor />
            </>
          )}
        </SmoothScroll>
      </body>
    </html>
  );
}

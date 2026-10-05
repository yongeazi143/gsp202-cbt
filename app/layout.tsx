import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

import { ToastProvider } from "@/context/ToastContext";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "GSP 202 CBT Terminal | Peace & Conflict Resolution",
  description:
    "High-speed Computer-Based Test Simulator with 228 verified textbook & workbook questions for GSP 202 Peace and Conflict Resolution",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`h-full ${plusJakarta.variable} ${outfit.variable}`}>
      <body className="h-full bg-[#0b0f17] text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-white">
        <ToastProvider>
          {children}
        </ToastProvider>
        <Analytics />
      </body>
    </html>
  );
}


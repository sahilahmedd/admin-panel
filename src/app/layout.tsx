import "./globals.css";
import { SessionProvider } from "next-auth/react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import MyLayout from "@/components/MyLayout";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin Panel",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider>
          <MyLayout>{children}</MyLayout>
        </SessionProvider>
      </body>
    </html>
  );
}

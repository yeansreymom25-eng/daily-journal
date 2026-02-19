import type { Metadata } from "next";
import "./globals.css";
import { Patrick_Hand, Inter } from "next/font/google";

const handwriting = Patrick_Hand({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-hand",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Daily Journal",
  description: "Write your thoughts and track your mood every day.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${handwriting.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}

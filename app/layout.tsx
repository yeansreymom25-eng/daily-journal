import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

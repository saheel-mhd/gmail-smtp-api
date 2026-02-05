import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gmail SMTP API",
  description: "Fast queue-backed Gmail SMTP API"
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

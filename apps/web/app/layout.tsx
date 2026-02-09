import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { ToastProvider } from "../components/ui/toast";
import { TopLoader } from "../components/ui/top-loader";
import { PageTransition } from "../components/page-transition";

export const metadata: Metadata = {
  title: "Gmail SMTP API",
  description: "Fast queue-backed Gmail SMTP API"
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <Suspense fallback={null}>
            <TopLoader />
          </Suspense>
          <Suspense fallback={null}>
            <PageTransition>{children}</PageTransition>
          </Suspense>
        </ToastProvider>
      </body>
    </html>
  );
}

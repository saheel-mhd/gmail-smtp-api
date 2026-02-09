import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "../components/ui/toast";
import { TopLoader } from "../components/ui/top-loader";
import { PageTransition } from "../components/page-transition";

export const metadata: Metadata = {
  title: "YeetMail",
  description: "Fast direct-send Gmail SMTP platform"
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <TopLoader />
          <PageTransition>{children}</PageTransition>
        </ToastProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/lib/SessionContext";

export const metadata: Metadata = {
  title: "GstAudit - GStreamer Pipeline Auditing",
  description: "A live way to audit your running GStreamer pipeline",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased" suppressHydrationWarning>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}

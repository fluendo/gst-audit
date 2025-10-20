import type { Metadata } from "next";
import "./globals.css";

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
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

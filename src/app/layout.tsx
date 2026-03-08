import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OSINT Monitor | Intelligence Dashboard",
  description: "Palantir-inspired OSINT monitoring dashboard for real-time intelligence analysis",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-osint-bg text-osint-text antialiased font-sans min-h-screen overflow-hidden">
        {children}
      </body>
    </html>
  );
}

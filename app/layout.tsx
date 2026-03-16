import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gigly",
  description: "Gigly web application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="text-white min-h-screen" style={{ backgroundColor: 'var(--bg-surface-level-0)' }}>
        {children}
      </body>
    </html>
  );
}

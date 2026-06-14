import type { Metadata } from "next";
import { fontSans, fontMono } from "./fonts";
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
    <html lang="en" className={`${fontSans.variable} ${fontMono.variable}`}>
      <body className="font-sans bg-background text-foreground min-h-screen">
        {children}
      </body>
    </html>
  );
}

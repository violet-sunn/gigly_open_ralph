import type { Metadata } from "next";
import { fontMono, fontGrotesk } from "./fonts";
import { THEME_BOOT_SCRIPT } from "@/lib/theme";
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
    <html lang="en" className={`${fontMono.variable} ${fontGrotesk.variable}`} suppressHydrationWarning>
      <head>
        {/* add-light-theme: apply the stored theme before first paint (no flash-of-dark). */}
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
      </head>
      <body className="font-sans bg-background text-foreground min-h-screen">
        {children}
      </body>
    </html>
  );
}

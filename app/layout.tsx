import type { Metadata, Viewport } from "next";
import { allFontVariables, cairo } from "@/styles/fonts";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { Toaster } from "react-hot-toast";
import PWAInstaller from "@/components/ui/PWAInstaller";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "لوحة التحكم - مؤسسة إنسان",
  description: "لوحة التحكم الإدارية لمؤسسة إنسان للأعمال الإنسانية",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "إنسان أدمن",
  },
};

export const viewport: Viewport = {
  themeColor: "#1A5F7A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: true,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" data-scroll-behavior="smooth" className={allFontVariables} suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={cairo.className}>
        <ThemeProvider>
          <Toaster position="top-center" />
          {children}
          <PWAInstaller />
        </ThemeProvider>
      </body>
    </html>
  );
}

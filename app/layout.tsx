import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "AI Assistant - Your Smart Mobile Companion",
  description: "Comprehensive AI assistant for emotional support, agriculture, health, tech and more",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AI Assistant",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0073e6",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-neutral-50">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

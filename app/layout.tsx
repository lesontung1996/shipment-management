import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/app/providers";
import { NavLinks } from "@/components/common/nav-links";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shipment Management",
  description: "Internal tool for managing last-mile shipments",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex h-full flex-col overflow-hidden">
        <Providers>
          <header className="flex h-11 shrink-0 items-center gap-4 border-b bg-background px-4">
            <span className="text-sm font-semibold tracking-tight">
              Shipment Management
            </span>
            <NavLinks />
          </header>
          <main className="min-h-0 flex-1">{children}</main>
        </Providers>
      </body>
    </html>
  );
}

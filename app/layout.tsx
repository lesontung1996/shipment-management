import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/app/providers";
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
            <nav className="flex items-center gap-1 text-sm">
              <Link
                href="/"
                className="rounded-md px-2.5 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                Shipments
              </Link>
              <Link
                href="/assignments"
                className="rounded-md px-2.5 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                Assignments
              </Link>
            </nav>
          </header>
          <main className="min-h-0 flex-1">{children}</main>
        </Providers>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Josefin_Sans,
  Platypi,
  Scope_One,
} from "next/font/google";
import "./globals.css";
import Navbar from "@/components/custom/nav-bar";
import Footer from "@/components/custom/footer";
import { BreadcrumbGenerator } from "@/components/custom/breadcrumb-generator";
import { SessionProvider } from "@/components/providers/session-provider";
import { Suspense } from "react";
import { CircleDashed } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const scopeOne = Scope_One({
  subsets: ["latin"],
  variable: "--font-scope-one",
  weight: "400",
});

const platypi = Platypi({
  variable: "--font-platypi",
  subsets: ["latin"],
});

const josefinSans = Josefin_Sans({
  variable: "--font-josefin-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Frontier Finds",
  description: "Get the best and latest finds on the internet.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${josefinSans.variable} ${scopeOne.variable} ${platypi.variable} antialiased flex flex-col min-h-screen font-geist bg-neutral-100`}
      >
        <SessionProvider>
          <Suspense
            fallback={
              <div className="min-h-full h-screen w-full flex items-center">
                <CircleDashed size={25} className="animate-spin duration-100" />
              </div>
            }
          >
            <Navbar />
            <BreadcrumbGenerator />

            {children}
            <Footer />
          </Suspense>
        </SessionProvider>
      </body>
    </html>
  );
}

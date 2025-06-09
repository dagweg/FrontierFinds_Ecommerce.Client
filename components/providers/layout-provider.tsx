"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/custom/nav-bar";
import Footer from "@/components/custom/footer";
import { BreadcrumbGenerator } from "@/components/custom/breadcrumb-generator";

interface LayoutProviderProps {
  children: React.ReactNode;
}

export function LayoutProvider({ children }: LayoutProviderProps) {
  const pathname = usePathname();

  // Check if current path is an auth page
  const isAuthPage =
    pathname?.startsWith("/accounts/signin") ||
    pathname?.startsWith("/accounts/signup") ||
    pathname?.startsWith("/accounts/verify");

  if (isAuthPage) {
    // Render only children for auth pages (clean layout)
    return <>{children}</>;
  }

  // Render with navigation for all other pages
  return (
    <>
      <Navbar />
      <BreadcrumbGenerator />
      {children}
      <Footer />
    </>
  );
}

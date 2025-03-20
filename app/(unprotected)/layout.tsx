import { BreadcrumbGenerator } from "@/components/custom/breadcrumb-generator";
import Footer from "@/components/custom/footer";
import Navbar from "@/components/custom/nav-bar";
import clsx from "clsx";
import { headers } from "next/headers";
import React from "react";

function PreLoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={clsx("min-h-screen w-full  mx-auto max-w-[2000px]")}>
      {children}
    </div>
  );
}

export default PreLoginLayout;

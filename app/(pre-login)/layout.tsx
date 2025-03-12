import { BreadcrumbGenerator } from "@/components/custom/breadcrumb";
import Footer from "@/components/custom/footer";
import Navbar from "@/components/custom/nav-bar";
import clsx from "clsx";
import { headers } from "next/headers";
import React from "react";

async function PostLoginLayout({ children }: { children: React.ReactNode }) {
  var headersList = await headers();
  var pathname = new URL(headersList.get("referer") || "").pathname;
  return (
    <div className={clsx("min-h-screen w-full  mx-auto max-w-[2000px]")}>
      {children}
    </div>
  );
}

export default PostLoginLayout;

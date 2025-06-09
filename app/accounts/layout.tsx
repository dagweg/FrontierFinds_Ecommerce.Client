import Link from "next/link";
import React from "react";
import { IconHome } from "@tabler/icons-react";

function AccountsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full relative bg-transparent">
      {/* Clean auth layout without navbar/footer */}

      {/* Optional home button in top corner */}
      <Link
        href="/"
        className="absolute top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-white/10 dark:bg-black/10 backdrop-blur-sm rounded-full border border-white/20 dark:border-gray-800/50 hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-200 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
      >
        <IconHome className="w-4 h-4" />
        <span className="text-sm font-medium">Home</span>
      </Link>

      {/* Auth content */}
      <main className="w-full h-full">{children}</main>
    </div>
  );
}

export default AccountsLayout;

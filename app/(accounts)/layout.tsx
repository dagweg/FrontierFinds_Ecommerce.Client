import Link from "next/link";
import React from "react";

function AccountsLayout({ children }: { children: React.ReactNode }) {
  return <div className=" w-full py-10">{children}</div>;
}

export default AccountsLayout;

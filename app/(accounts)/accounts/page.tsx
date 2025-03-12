import { redirect } from "next/navigation";
import React from "react";

function AccountsPage() {
  redirect("/accounts/signin");
  return <div>AccountsPage</div>;
}

export default AccountsPage;

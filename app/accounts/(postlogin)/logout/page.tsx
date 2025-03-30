"use client";

import withAuth from "@/lib/decorators/withAuth";
import { useEnvStore } from "@/lib/zustand/useEnvStore";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useLayoutEffect } from "react";

function LogoutPage() {
  const router = useRouter();
  const { apiBaseUrl } = useEnvStore();
  useLayoutEffect(() => {
    (async () => {
      let r = await fetch(`${apiBaseUrl}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (r.ok) router.push("/accounts/signin");
    })();
  }, []);
  return (
    <div className="mx-auto h-screen w-fit flex flex-col items-center gap-3 py-32">
      <Loader className="animate-spin" size={30} />
      Logging you out...
    </div>
  );
}

export default withAuth(LogoutPage);

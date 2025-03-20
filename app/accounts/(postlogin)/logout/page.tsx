"use client";

import { useEnvStore } from "@/lib/zustand/useEnvStore";
import { Loader } from "lucide-react";
import React, { useLayoutEffect } from "react";

function LogoutPage() {
  const { apiBaseUrl } = useEnvStore();
  useLayoutEffect(() => {
    (async () => {
      let r = await fetch(`${apiBaseUrl}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (r.ok) location.reload();
    })();
  }, []);
  return (
    <div className="mx-auto h-screen w-fit flex flex-col items-center gap-3 py-32">
      <Loader className="animate-spin" size={30} />
      Logging you out...
    </div>
  );
}

export default LogoutPage;

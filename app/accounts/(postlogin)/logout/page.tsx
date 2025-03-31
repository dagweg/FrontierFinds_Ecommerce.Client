"use client";

import { useSession } from "@/components/providers/session-provider";
import withAuth from "@/lib/decorators/withAuth";
import { useEnvStore } from "@/lib/zustand/useEnvStore";
import { Loader } from "lucide-react";

import { useRouter } from "next/navigation";
import React, { useEffect, useLayoutEffect } from "react";

function LogoutPage() {
  const router = useRouter();
  const { apiBaseUrl } = useEnvStore();

  const { isLoggedIn } = useSession();

  useEffect(() => {
    if (!isLoggedIn) router.push("/accounts/signin");
    (async () => {
      let r = await fetch(`${apiBaseUrl}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      window.location.reload();
    })();
  }, [isLoggedIn]);

  // useLayoutEffect(() => {
  //   (async () => {
  //     let r = await fetch(`${apiBaseUrl}/auth/logout`, {
  //       method: "POST",
  //       credentials: "include",
  //     });
  //     if (r.ok) router.push("/accounts/signin");
  //   })();
  // }, []);
  return (
    <div className="mx-auto h-screen w-fit flex flex-col items-center gap-3 py-32">
      <Loader className="animate-spin" size={30} />
      Logging you out...
    </div>
  );
}

export default withAuth(LogoutPage);

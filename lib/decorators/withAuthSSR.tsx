import { useSession } from "@/components/providers/session-provider";
import { cookies, headers } from "next/headers";

import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function withAuthSSR(WrappedComponent: React.ComponentType) {
  return async (props: {}) => {
    // Return an async Server Component directly
    const cookieStore = cookies();
    const apiUrl: string | undefined = process.env.NEXT_PUBLIC_API_BASE_URL;

    try {
      const authRes = await fetch(`${apiUrl}/auth/authorize`, {
        credentials: "include", // To send cookies
        headers: {
          cookie: cookieStore.toString() || "", // Get cookies from cookieStore
        },
      });

      if (!authRes.ok) {
        redirect("/accounts/signin"); // Server-side redirect using next/navigation's redirect
      }
    } catch (error) {
      console.error("Authentication error in withAuthAppDir:", error);
      redirect("/accounts/signin"); // Redirect on error as well for security
    }

    return <WrappedComponent {...props} />; // If authenticated, render the WrappedComponent
  };
}

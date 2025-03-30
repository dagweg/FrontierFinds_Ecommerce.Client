import { useSession } from "@/components/providers/session-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function withAuth(WrappedComponent: React.ComponentType) {
  const AuthenticatedComponent: React.FC = (props) => {
    const router = useRouter();
    const { isLoggedIn } = useSession();

    useEffect(() => {
      if (!isLoggedIn) {
        router.push("/accounts/signin");
      }
    }, [isLoggedIn, router]);

    if (!isLoggedIn) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  AuthenticatedComponent.displayName = `withAuth(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return AuthenticatedComponent;
}

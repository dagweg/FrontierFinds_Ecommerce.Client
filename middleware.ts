import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define a type for the paths
type Path = string;

const clientUrl: string | undefined = process.env.NEXT_PUBLIC_CLIENT_BASE_URL;
const apiUrl: string | undefined = process.env.NEXT_PUBLIC_API_BASE_URL;

const preLoginPaths: Path[] = [
  "/accounts/signup",
  "/accounts/signin",
  "/accounts/verify",
];
const postLoginPaths: Path[] = [
  "/accounts/logout",
  "/accounts/profile",
  "/products",
  "/cart",
  "/checkout",
  "/store/:path*",
];
export const unprotectedPaths: Path[] = [
  "/store",
  "/",
  "/not-found",
  "/create-product-listing", // remove (just for dev purpose)
];

export let config = {
  matcher: [
    "/accounts/:path*",
    "/products/:path*",
    "/cart",
    "/checkout",
    "/store",
    "/store/:path*",
    "/",
  ],
};

const signInUrl = (path: string) =>
  `/accounts/signin?callbackUrl=${encodeURIComponent(path)}`;
/**
 * Matches a path exactly against an array of patterns (no wildcards).
 * @param path - The path to match.
 * @param patterns - The array of exact path patterns.
 * @returns Whether the path exactly matches any of the patterns.
 */
const matchPath = (path: string, patterns: Path[]): boolean => {
  return patterns.includes(path); // Exact string match
};

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const path = request.nextUrl.pathname;
  const headers = new Headers(request.headers);
  headers.set("x-current-path", path);

  const authRes = await fetch(`${apiUrl}/auth/authorize`, {
    credentials: "include",
    headers: {
      cookie: request.headers.get("cookie") || "",
    },
  });

  const isLoggedIn = authRes.ok;
  headers.set("x-is-logged-in", isLoggedIn.toString());

  if (path.startsWith("/store/") && !isLoggedIn) {
    return NextResponse.redirect(new URL(signInUrl(path), request.url));
  }

  // Allow unprotected paths without authorization
  if (matchPath(path, unprotectedPaths)) {
    return NextResponse.next({ headers });
  }

  // --- Redirection Logic ---
  if (!isLoggedIn) {
    // Not logged in

    if (matchPath(path, postLoginPaths)) {
      // Trying to access a post-login path, redirect to sign-in
      // Optional: Add callback URL
      return NextResponse.redirect(new URL(signInUrl(path), request.url));
    }
  } else {
    // Logged in

    if (matchPath(path, preLoginPaths)) {
      // Trying to access a pre-login path while logged in, redirect to homepage or profile
      return NextResponse.redirect(new URL("/", request.url)); // Redirect to homepage
      // or
      // return NextResponse.redirect(new URL("/accounts/profile", request.url)); // Redirect to profile
    }
  }

  // If no redirection is needed, continue to the requested path
  return NextResponse.next({ headers });
}

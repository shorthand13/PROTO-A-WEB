import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const isProtectedRoute = createRouteMatcher([
  "/:locale/membership/videos(.*)",
]);

function checkBasicAuth(req: NextRequest): NextResponse | null {
  const password = process.env.SITE_PASSWORD;
  if (!password) return null; // no password set = no protection

  const authHeader = req.headers.get("authorization");
  if (authHeader) {
    const [scheme, encoded] = authHeader.split(" ");
    if (scheme === "Basic" && encoded) {
      const decoded = atob(encoded);
      const [, pwd] = decoded.split(":");
      if (pwd === password) return null; // authenticated
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Protected"' },
  });
}

export default clerkMiddleware(async (auth, req) => {
  const basicAuthResponse = checkBasicAuth(req);
  if (basicAuthResponse) return basicAuthResponse;

  if (isProtectedRoute(req)) {
    await auth.protect();
  }
  return intlMiddleware(req);
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};

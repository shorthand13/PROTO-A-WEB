import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest } from "next/server";

const intlMiddleware = createMiddleware(routing);

const isProtectedRoute = createRouteMatcher([
  "/:locale/membership/videos(.*)",
]);

export default function middleware(req: NextRequest) {
  if (isProtectedRoute(req)) {
    return clerkMiddleware(async (auth) => {
      await auth.protect();
      return intlMiddleware(req);
    })(req, {} as never);
  }
  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};

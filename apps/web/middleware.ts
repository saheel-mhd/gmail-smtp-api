import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const sessionCookie = req.cookies.get("gmail_smtp_session")?.value;
  const isLoggedIn = Boolean(sessionCookie);

  if (pathname === "/login" || pathname === "/register") {
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    const loginUrl = new URL("/login", req.nextUrl);
    loginUrl.searchParams.set("callbackUrl", `${pathname}${req.nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|admin|v1|_next/static|_next/image|favicon.ico).*)"]
};

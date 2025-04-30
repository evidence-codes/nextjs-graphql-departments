import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value
  const { pathname } = request.nextUrl

  // Check if the pathname is for protected routes
  const isProtectedRoute = pathname.startsWith("/departments") && pathname !== "/login"

  // If trying to access protected route without token, redirect to login
  if (isProtectedRoute && !token) {
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", encodeURI(pathname))
    return NextResponse.redirect(url)
  }

  // If already logged in and trying to access login page, redirect to departments
  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/departments", request.url))
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/departments/:path*", "/login"],
}

// middleware.ts
import { NextResponse, type NextRequest } from 'next/server'

const COOKIE_NAME = 'payload-token'

// Routes the user MUST be logged in to view
const PROTECTED = ['/account', '/orders', '/checkout']

// Routes the user MUST be logged OUT to view (guest-only, e.g. login/register)
const GUEST_ONLY = ['/login', '/register']

function isProtected(pathname: string) {
  return PROTECTED.some((p) => pathname === p || pathname.startsWith(`${p}/`))
}

function isGuestOnly(pathname: string) {
  return GUEST_ONLY.some((p) => pathname === p || pathname.startsWith(`${p}/`))
}

export function middleware(req: NextRequest) {
  const { nextUrl } = req
  const pathname = nextUrl.pathname

  const hasSession = Boolean(req.cookies.get(COOKIE_NAME)?.value) // cheap check

  // 1) Protected: no session -> go to /login?next=<original>
  if (isProtected(pathname) && !hasSession) {
    const url = new URL('/login', req.url)
    url.searchParams.set('next', pathname + (nextUrl.search || ''))
    return NextResponse.redirect(url)
  }

  // 2) Guest-only (login/register): already logged in -> send home (or /account)
  if (isGuestOnly(pathname) && hasSession) {
    const url = new URL('/account', req.url) // or '/'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

// Apply only where needed
export const config = {
  matcher: ['/account/:path*', '/orders/:path*', '/checkout/:path*', '/login', '/register'],
}

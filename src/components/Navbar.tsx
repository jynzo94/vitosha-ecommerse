// app/components/Navbar.tsx
import Link from 'next/link'
import { getMe } from '@/lib/auth'
import { Fragment } from 'react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { CartSheet } from './CartSheet' // виж компонента по-долу

export default async function Navbar() {
  const me = await getMe()

  return (
    <nav className="border-b">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
        <Button asChild variant="link" className="px-0 text-xl font-bold">
          <Link href="/">MySite</Link>
        </Button>

        <div className="flex items-center gap-3">
          {/* Cart sheet trigger */}
          <CartSheet />

          {!me && (
            <Fragment>
              <Button asChild variant="ghost">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Register</Link>
              </Button>
            </Fragment>
          )}

          {me && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Hi, {me.email}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/account">Account</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/logout">Logout</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  )
}

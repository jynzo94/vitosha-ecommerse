'use client'

import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import Link from 'next/link'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { useState } from 'react'

export function CartSheet() {
  const { cart } = useCart()
  const items = cart?.items ?? []
  const [isOpen, setOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost">Cart ({items.length})</Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[300px]">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>

        <div className="px-4 mt-4 space-y-4">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">Your cart is empty.</p>
          ) : (
            items.map((item) => {
              if (typeof item.product === 'string' || typeof item.variant ===  'string') {
                return null
              }
              return (
                <div key={item.id} className="border-b pb-2">
                  <div className="font-medium">{item.product?.title}</div>
                  <div className="text-sm text-muted-foreground">{item.variant?.title}</div>
                  <div className="mt-1">Qty: {item.quantity}</div>
                </div>
              )
            })
          )}
        </div>

        <SheetFooter className="flex items-center justify-between px-4 py-2">
          <Button className="w-full" asChild disabled={items.length === 0}>
            <Link href="/checkout">Продължи към плащане</Link>
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

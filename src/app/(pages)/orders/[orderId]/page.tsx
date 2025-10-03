// app/orders/[orderId]/page.tsx
'use client'

import * as React from 'react'
import { useParams } from 'next/navigation'

export default function OrderPage() {
  const { orderId } = useParams() as { orderId: string }
  // Fetch order details from your Payload REST/GraphQL if you want
  return (
    <div className="container py-10">
      <h1 className="text-2xl font-semibold">Thanks for your order!</h1>
      <p className="mt-4">Order ID: {orderId}</p>
      {/* render order summary */}
    </div>
  )
}

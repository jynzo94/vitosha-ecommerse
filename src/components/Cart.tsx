'use client'

import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import { useEffect } from 'react'

export default function AddToCartButton() {
  const { cart } = useCart()

  useEffect(() => {
    console.log('cart', cart)
  }, [cart])

  return (
    <div className="border p-4 rounded-xl">
      <h1 className="mb-4 text-3xl">Cart</h1>
      {cart?.items?.map((item) => {
        if (typeof item.product === 'string') {
          console.log('item.product is string')
          return null
        }
        if (typeof item.variant === 'string') {
          console.log('item.variant is string')
          return null
        }

        return (
          <div key={item.id} className="not-last:border-b">
            <div>
              <span className="text-pink-500">Product:</span> {item.product?.title}
            </div>
            <div>
              <span className="text-pink-500">Variant:</span> {item.variant?.title}
            </div>
            <div>
              <span className="text-pink-500">Quantity:</span> {item.quantity}
            </div>
          </div>
        )
      })}
    </div>
  )
}

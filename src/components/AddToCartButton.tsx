'use client'

import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import { Button } from './ui/button'

export default function AddToCartButton() {
  const { addItem } = useCart()

  const onClick = () => {
    console.log('addItem')

    addItem({
      product: '68dd9c2d2e0c05b36bf9a729',
      variant: '68dd9c712e0c05b36bf9a7f4',
    })
  }

  return <Button onClick={onClick}>Add to Cart</Button>
}

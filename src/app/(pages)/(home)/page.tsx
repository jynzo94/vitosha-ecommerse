import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import AddToCartButton from '@/components/AddToCartButton'
import Cart from '@/components/Cart'
import AddressForm from '@/components/AddressForm'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  return (
    <div>
      Home Page
      <div className="mt-20 space-y-10">
        <AddToCartButton />
        <Cart />
        <AddressForm />
      </div>
    </div>
  )
}

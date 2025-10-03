'use client'

import { Alert } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAddresses, useCart, usePayments } from '@payloadcms/plugin-ecommerce/client/react'
import { useCallback, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import CheckoutForm from './CheckoutForm'
import { Address } from '@/payload-types'

const stripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const customerEmail = 'alexander.m.kolarov@gmail.com'

export default function CheckoutPage() {
  const { initiatePayment } = usePayments()

  const [address, setAddress] = useState<Partial<Address>>({
    addressLine1: '',
    country: 'BG',
  })

  const [error, setError] = useState<string | null>(null)

  const [paymentData, setPaymentData] = useState<null | Record<string, unknown>>(null)

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    })
  }

  const initiatePaymentIntent = useCallback(
    async (paymentID: string) => {
      const cartID = localStorage.getItem('cart')

      try {
        const paymentData = (await initiatePayment(paymentID, {
          additionalData: {
            cartID,
            customerEmail,
            // billingAddress: address,
            // shippingAddress: address,
          },
        })) as Record<string, unknown>
        if (paymentData) {
          setPaymentData(paymentData)
        }
      } catch (error) {
        const errorData = error instanceof Error ? JSON.parse(error.message) : {}
        let errorMessage = 'An error occurred while initiating payment.'

        if (errorData?.cause?.code === 'OutOfStock') {
          errorMessage = 'One or more items in your cart are out of stock.'
        }

        setError(errorMessage)
      }
    },
    [address],
  )

  if (!stripe) {
    return <div className="h-screen w-screen bg-red-500">Loading...</div>
  }

  return (
    <div className="p-8">
      {error && <Alert className="text-destructive text-xl font-bold ">{error}</Alert>}
      <div className="mb-10">
        <form className="max-w-xl mx-auto border p-4 rounded">
          <h2 className="text-2xl font-semibold mb-4">Address</h2>
          <Label className="mb-2">Address line 1</Label>
          <Input onChange={onChangeInput} type="text" name="addressLine1" />
          {!paymentData && (
            <Button
              className="mt-4"
              onClick={(e) => {
                e.preventDefault()
                void initiatePaymentIntent('stripe')
              }}
            >
              Go to payment
            </Button>
          )}
        </form>

        <div className="max-w-xl mx-auto border p-4 rounded">
          <h2 className="text-2xl font-semibold mb-4">Payment</h2>
          {paymentData && (
            <Elements
              stripe={stripe}
              options={{ clientSecret: paymentData?.clientSecret as string }}
            >
              <PaymentElement />
              <CheckoutForm customerEmail={customerEmail} address={address} />
            </Elements>
          )}
        </div>
      </div>
    </div>
  )
}

'use client'

import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Address } from '@/payload-types'
import { useCart, usePayments } from '@payloadcms/plugin-ecommerce/client/react'
import { useStripe, useElements } from '@stripe/react-stripe-js'
import { useRouter } from 'next/navigation'
import { FormEvent, useCallback, useState } from 'react'

type Props = {
  customerEmail: string
  address: Partial<Address>
}

export default function CheckoutForm(props: Props) {
  const [paymentLoading, setPaymentLoading] = useState(false)
  const stripe = useStripe()
  const elements = useElements()
  const { confirmOrder } = usePayments()
  const { clearCart } = useCart()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const onPay = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      setPaymentLoading(true)

      if (stripe && elements) {
        try {
          const returnUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/checkout/confirm-order?email=${`${props.customerEmail}`}`

          const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
            confirmParams: {
              return_url: returnUrl,
              payment_method_data: {
                billing_details: {
                  email: 'alexander.m.kolarov@gmail.com',
                  address: {
                    line1: props.address?.addressLine1,
                    country: props.address?.country,
                  },
                },
              },
            },
            elements,
            redirect: 'if_required',
          })

          if (paymentIntent && paymentIntent.status === 'succeeded') {
            try {
              const confirmResult = await confirmOrder('stripe', {
                additionalData: {
                  paymentIntentID: paymentIntent.id,
                  customerEmail: props.customerEmail,
                },
              })

              if (
                confirmResult &&
                typeof confirmResult === 'object' &&
                'orderID' in confirmResult &&
                confirmResult.orderID
              ) {
                const redirectUrl = `/orders/${confirmResult.orderID}?email=${`${props.customerEmail}`}`

                // Clear the cart after successful payment
                // clearCart()

                // Redirect to order confirmation page
                router.push(redirectUrl)
              }
            } catch (err) {
              console.log({ err })
              const msg = err instanceof Error ? err.message : 'Something went wrong.'
              setError(`Error while confirming order: ${msg}`)
              setPaymentLoading(false)
            }
          }
          if (stripeError?.message) {
            setError(stripeError.message)
            setPaymentLoading(false)
          }
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Something went wrong.'
          setError(`Error while submitting payment: ${msg}`)
          setPaymentLoading(false)
        }
      }
    },
    [stripe, elements, confirmOrder, clearCart, router],
  )

  return (
    <div>
      {error && <Alert>{error}</Alert>}
      <form onSubmit={onPay}>
        <Button type="submit" disabled={paymentLoading}>
          {paymentLoading ? 'Processing...' : 'Pay'}
        </Button>
        {error && <div>{error}</div>}
      </form>
    </div>
  )
}

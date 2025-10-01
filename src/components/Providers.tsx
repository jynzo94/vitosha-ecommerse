import { EcommerceProvider } from '@payloadcms/plugin-ecommerce/client/react'
// Import any payment adapters you want to use on the client side
import { stripeAdapterClient } from '@payloadcms/plugin-ecommerce/payments/stripe'
import { PropsWithChildren } from 'react'

export const Providers = ({ children }: PropsWithChildren) => (
  <EcommerceProvider
    api={{
      cartsFetchQuery: {
        depth: 2,
        populate: {
          products: {
            title: true,
          },
          variants: {
            title: true,
          },
        },
      },
    }}
    debug
  >
    {children}
  </EcommerceProvider>
)

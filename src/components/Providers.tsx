import { EcommerceProvider } from '@payloadcms/plugin-ecommerce/client/react'
// Import any payment adapters you want to use on the client side
import { stripeAdapterClient } from '@payloadcms/plugin-ecommerce/payments/stripe'
import { PropsWithChildren } from 'react'

export const Providers = ({ children }: PropsWithChildren) => (
  <EcommerceProvider
    syncLocalStorage={{ key: 'payload-cart' }}
    api={{
      apiRoute: '/api',
      serverURL: 'http://localhost:3000',
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

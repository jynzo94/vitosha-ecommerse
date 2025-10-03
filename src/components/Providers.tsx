import { EcommerceProvider } from '@payloadcms/plugin-ecommerce/client/react'
// Import any payment adapters you want to use on the client side
import { PropsWithChildren } from 'react'
import { ThemeProvider } from './ThemeProvider'
import { stripeAdapterClient } from '@payloadcms/plugin-ecommerce/payments/stripe'

export const Providers = ({ children }: PropsWithChildren) => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
    <EcommerceProvider
      // syncLocalStorage={{ key: 'payload-cart' }}
      enableVariants
      paymentMethods={[
        stripeAdapterClient({
          publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
        }),
      ]}
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
  </ThemeProvider>
)

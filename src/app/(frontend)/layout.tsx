import React from 'react'
import './styles.css'
import { Providers } from '@/components/Providers'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white p-4">
        <Providers>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  )
}

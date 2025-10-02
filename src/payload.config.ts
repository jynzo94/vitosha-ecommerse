// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { ecommercePlugin } from '@payloadcms/plugin-ecommerce'
import { stripeAdapter } from '@payloadcms/plugin-ecommerce/payments/stripe'

import { Media } from './collections/Media'
import { ProductsCollection } from './collections/Products'
import { Users } from './collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: 'users',
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    ecommercePlugin({
      // inventory: false,
      addresses: {
        addressesCollectionOverride: ({ defaultCollection }) => {
          console.log('addressesCollectionOverride', defaultCollection)
          return {
            ...defaultCollection,
            admin: {
              ...defaultCollection.admin,
              hidden: false,
            },
            fields: [
              {
                name: 'title',
                type: 'text',
                required: true,
              },
              {
                name: 'address',
                type: 'text',
                required: true,
              },
              {
                name: 'customer',
                type: 'relationship',
                label: 'Customer',
                relationTo: 'users',
              },
            ],
          }
        },
      },
      payments: {
        paymentMethods: [
          stripeAdapter({
            secretKey: process.env.STRIPE_SECRET_KEY!,
            publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
            webhookSecret: process.env.STRIPE_WEBHOOKS_SIGNING_SECRET!,
          }),
        ],
      },
      access: {
        adminOnly: () => true,
        adminOnlyFieldAccess: () => true,
        adminOrCustomerOwner: () => true,
        adminOrPublishedStatus: () => true,
        customerOnlyFieldAccess: () => true,
        publicAccess: () => true,
        authenticatedOnly: () => true,
      },
      customers: { slug: 'users' },
      products: {
        variants: true,
        productsCollectionOverride: ProductsCollection,
      },
    }),
  ],
})

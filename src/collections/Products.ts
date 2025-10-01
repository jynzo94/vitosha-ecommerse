import { CollectionOverride } from '@payloadcms/plugin-ecommerce/types'

export const ProductsCollection: CollectionOverride = ({ defaultCollection }) => ({
  ...defaultCollection,
  fields: [
    ...defaultCollection.fields,
    {
      name: 'title',
      type: 'text',
    },
  ],
  admin: {
    useAsTitle: 'title',
  },
})

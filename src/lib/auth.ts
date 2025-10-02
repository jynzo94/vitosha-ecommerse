// app/lib/auth.ts (server)
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function getMe() {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() }) // чете cookie/JWT
  return user // null ако няма сесия
}

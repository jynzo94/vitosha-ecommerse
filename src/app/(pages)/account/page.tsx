import { getMe } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function Account() {
  const user = await getMe()

  if (!user) {
    redirect('/login')
  }

  return (
    <div>
      <h1>Account Page</h1>
      <p>{JSON.stringify(user, null, 2)}</p>
    </div>
  )
}

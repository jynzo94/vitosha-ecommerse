// app/(auth)/actions.ts
'use server'

import { cookies } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import cms from '@/lib/cms'

type RegisterState = { ok: boolean; message?: string }

export async function registerActionState(_: RegisterState, fd: FormData): Promise<RegisterState> {
  try {
    const email = String(fd.get('email'))
    const password = String(fd.get('password'))

    await cms.create({ collection: 'users', data: { email, password } })

    return { ok: true, message: 'Account created.' }
  } catch (e: any) {
    return { ok: false, message: e?.message ?? 'Something went wrong' }
  }
}

// app/(auth)/actions.ts
export async function loginAction(email: string, password: string) {
  const payload = await getPayload({ config })
  const { token, user, exp } = await payload.login({
    collection: 'users',
    data: { email, password },
  })
  //   cookies().set({
  //     name: 'payload-token',
  //     value: token,
  //     httpOnly: true,
  //     sameSite: 'lax',
  //     secure: process.env.NODE_ENV === 'production',
  //     path: '/',
  //     expires: new Date(exp * 1000),
  //   })
  return { id: user.id, email: user.email }
}

export async function logoutAction() {
  //   const payload = await getPayload({ config })
  //   await payload.logout({ collection: 'users', all: false })
  //   cookies().delete('payload-token')
}

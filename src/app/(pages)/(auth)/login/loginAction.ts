'use server'

import cms from '@/lib/cms'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import schema from './schema'

type RegisterState = { ok: boolean; message?: string }

export async function loginAction(_: RegisterState, fd: FormData): Promise<RegisterState> {
  try {
    const emailFd = String(fd.get('email') ?? '')

    const raw = {
      email: emailFd,
      password: String(fd.get('password') ?? ''),
    }

    const parsed = schema.safeParse(raw)
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message ?? 'Invalid data'
      return { ok: false, message: msg }
    }

    const { email, password } = parsed.data

    const { token, user, exp } = await cms.login({
      collection: 'users',
      data: { email, password },
    })

    const c = await cookies()

    if (token && exp && user) {
      c.set('payload-token', token, {
        path: '/',
        expires: exp * 1000,
        sameSite: 'lax',
        httpOnly: false,
        secure: false,
      })
    } else {
      return { ok: false, message: 'Something went wrong' }
    }
  } catch (e: any) {
    return { ok: false, message: e?.message ?? 'Something went wrong' }
  }

  return redirect('/account')
}

'use server'

import cms from '@/lib/cms'
import schema from './schema'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

type RegisterState = { ok: boolean; message?: string }

export async function registerAction(_: RegisterState, fd: FormData): Promise<RegisterState> {
  try {
    const emailFd = String(fd.get('email') ?? '')

    const exist = await cms
      .find({
        collection: 'users',
        where: {
          email: {
            equals: emailFd,
          },
        },
      })
      .then((res) => res.docs[0])

    if (exist) {
      return { ok: false, message: 'Email already exists' }
    }

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

    await cms.create({ collection: 'users', data: { email, password } })

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

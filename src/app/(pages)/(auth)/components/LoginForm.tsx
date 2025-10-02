'use client'
import { useActionState } from 'react' // или useFormState при по-стар React
import { registerActionState } from '../actions'

const initial = { ok: false, message: '' }

export function RegisterForm() {
  const [state, formAction] = useActionState(registerActionState, initial)
  return (
    <form action={formAction}>
      <input name="email" type="email" required />
      <input name="password" type="password" required minLength={8} />
      <button type="submit">Create account</button>
      {state.message && <p>{state.message}</p>}
    </form>
  )
}

'use client'

import * as React from 'react'
import { useRef, useTransition } from 'react'
import { useActionState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { loginAction } from './loginAction'
import schema from './schema'

const initial = { ok: false, message: '' }
type Values = z.infer<typeof schema>

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, initial)
  const formRef = useRef<HTMLFormElement>(null)
  const [isPending, startTransition] = useTransition()

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
    mode: 'onChange',
  })

  const onSubmit = form.handleSubmit(() => {
    if (!formRef.current) return
    const fd = new FormData(formRef.current)
    startTransition(() => {
      formAction(fd)
    })
  })

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {state.message && (
          <Alert variant={state.ok ? 'default' : 'destructive'}>
            <AlertTitle>{state.ok ? 'Success' : 'Error'}</AlertTitle>
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form
            ref={formRef}
            onSubmit={(e) => {
              e.preventDefault()
              onSubmit()
            }}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" autoComplete="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete="new-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Loading...' : 'Login'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

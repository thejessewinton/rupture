'use client'

import { useState } from 'react'

import { useForm } from 'react-hook-form'

import { Button } from '~/components/shared/button'
import { Input } from '~/components/shared/input'
import { api } from '~/trpc/react'
import { type RouterInputs } from '~/trpc/shared'

type FormValues = RouterInputs['marketing']['addNew']

export const WaitlistForm = () => {
  const [message, setMessage] = useState<null | string>(null)
  const waitlist = api.marketing.addNew.useMutation({
    onSuccess: (data) => {
      setMessage(data.message)
    }
  })

  const { handleSubmit, register } = useForm<FormValues>({
    defaultValues: {
      email: ''
    }
  })

  const onSubmit = (values: FormValues) => {
    waitlist.mutate(values)
  }

  if (message) {
    return <p>{message}</p>
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='max-w-xl'>
      <Input type='email' {...register('email')} />
      <Button type='submit'>Join waitlist</Button>
    </form>
  )
}

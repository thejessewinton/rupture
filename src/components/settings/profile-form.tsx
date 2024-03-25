'use client'

import { useEffect } from 'react'

import { useForm } from 'react-hook-form'

import { api } from '~/trpc/react'
import { type RouterInputs, type RouterOutputs } from '~/trpc/shared'
import { Button } from '../shared/button'
import { Input } from '../shared/input'

type ProfileValues = RouterInputs['user']['updateUser']

export const ProfileForm = ({ user }: { user?: RouterOutputs['user']['getCurrent'] }) => {
  const utils = api.useUtils()
  const { register, handleSubmit, reset } = useForm<ProfileValues>()

  useEffect(() => {
    if (user) {
      reset({
        name: user.name!,
        email: user.email
      })
    }
  }, [user, reset])

  const submit = api.user.updateUser.useMutation({
    onSuccess: async () => {
      await utils.user.getCurrent.invalidate()
    }
  })

  const onSubmit = async (values: ProfileValues) => {
    await submit.mutateAsync(values)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='col-span-12 flex w-full flex-col gap-4 md:col-span-8'>
      <Input type='text' {...register('name')} label='Name' />
      <Input type='text' {...register('email')} label='Email' />
      <Button type='submit' disabled={submit.isLoading}>
        {submit.isLoading ? 'Loading' : 'Update'}
      </Button>
    </form>
  )
}

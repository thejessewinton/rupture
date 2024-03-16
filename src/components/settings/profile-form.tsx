'use client'

import { useForm } from 'react-hook-form'
import { api } from '~/trpc/react'
import { type RouterOutputs, type RouterInputs } from '~/trpc/shared'
import { Button } from '~/components/shared/button'
import { Input } from '~/components/shared/input'
import { useEffect } from 'react'

type ProfileValues = RouterInputs['user']['updateUser']

export const ProfileForm = () => {
  const utils = api.useUtils()
  const { data, isLoading } = api.user.getCurrent.useQuery()

  const { register, handleSubmit, reset } = useForm<ProfileValues>({
    defaultValues: {
      name: data?.name!,
      email: data?.email!
    }
  })

  const submit = api.user.updateUser.useMutation({
    onSuccess: async () => {
      await utils.user.getCurrent.invalidate()
    }
  })

  const onSubmit = async (values: ProfileValues) => {
    await submit.mutateAsync(values)
  }

  useEffect(() => {
    if (data) {
      reset({
        name: data.name!,
        email: data.email
      })
    }
  }, [data])

  if (isLoading) return

  return (
    <div className='w-full animate-fade-in space-y-8'>
      <div className='space-y-1'>
        <h3 className='text-lg'>Profile</h3>
        <p className='text-sm text-neutral-500'>Manage your Rupture profile</p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col gap-4 border-t border-neutral-200 pt-8 dark:border-neutral-800'
      >
        <Input type='text' {...register('name')} label='Name' />
        <Input type='text' {...register('email')} label='Email' />
        <Button type='submit' disabled={submit.isLoading}>
          {submit.isLoading ? 'Loading' : 'Update'}
        </Button>
      </form>
    </div>
  )
}

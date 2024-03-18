'use client'

import { useEffect } from 'react'

import dayjs from 'dayjs'
import { useForm } from 'react-hook-form'

import { CompositionAction } from '~/components/settings/composition-action'
import { Button } from '~/components/shared/button'
import { Input } from '~/components/shared/input'
import { api } from '~/trpc/react'
import { type RouterInputs } from '~/trpc/shared'

type ProfileValues = RouterInputs['user']['updateUser']

export default function SettingsPage() {
  const utils = api.useUtils()
  const { data, isLoading } = api.user.getCurrent.useQuery()

  const { register, handleSubmit, reset } = useForm<ProfileValues>()

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
  }, [data, reset])

  if (isLoading) return

  return (
    <div className='w-full gap-4 space-y-8'>
      <div className='space-y-1 '>
        <h3 className='text-lg'>Profile</h3>
        <p className='text-sm text-neutral-500'>Manage your Rupture profile and progress</p>
      </div>
      <div className='grid gap-8 border-t border-neutral-200 pt-8 dark:border-neutral-800 md:grid-cols-12'>
        <form onSubmit={handleSubmit(onSubmit)} className='col-span-8 flex flex-col gap-4'>
          <Input type='text' {...register('name')} label='Name' />
          <Input type='text' {...register('email')} label='Email' />
          <Button type='submit' disabled={submit.isLoading}>
            {submit.isLoading ? 'Loading' : 'Update'}
          </Button>
        </form>
        <div className='col-span-4 flex flex-col gap-4'>
          <span className='text-xs'>Composition</span>
          <ul className='w-full divide-y divide-neutral-200 dark:divide-neutral-800'>
            {data?.composition.map((composition) => (
              <li className='flex justify-between px-2 py-4 text-xs' key={composition.id}>
                <span>
                  {composition.weight} {composition.unit}.
                </span>
                <span>{dayjs(composition.created_at).format('MM/DD/YY')}</span>
              </li>
            ))}
          </ul>
          <CompositionAction />
        </div>
      </div>
    </div>
  )
}

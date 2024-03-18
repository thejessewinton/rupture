'use client'

import { useEffect } from 'react'

import dayjs from 'dayjs'
import { useForm } from 'react-hook-form'

import { Button } from '~/components/shared/button'
import { Input } from '~/components/shared/input'
import { useDialogStore } from '~/state/use-dialog-store'
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
      <div className='grid gap-4 border-t border-neutral-200 pt-8 dark:border-neutral-800 md:grid-cols-12'>
        <form onSubmit={handleSubmit(onSubmit)} className='col-span-8 flex flex-col gap-4'>
          <Input type='text' {...register('name')} label='Name' />
          <Input type='text' {...register('email')} label='Email' />
          <Button type='submit' disabled={submit.isLoading}>
            {submit.isLoading ? 'Loading' : 'Update'}
          </Button>
        </form>
        <div className='col-span-4 flex flex-col gap-4'>
          {data?.composition.map((composition) => (
            <>
              {composition.weight} - {dayjs(composition.created_at).format('MMM, DD')}
            </>
          ))}
          <CompositionAction />
        </div>
      </div>
    </div>
  )
}

type CompositionValues = RouterInputs['user']['createComposition']

const CompositionForm = () => {
  const { register, handleSubmit, reset } = useForm<CompositionValues>()
  const { handleDialogClose } = useDialogStore()

  const utils = api.useUtils()
  const submit = api.user.createComposition.useMutation({
    onSuccess: async () => {
      reset()
      handleDialogClose()
      await utils.user.getCurrent.invalidate()
    }
  })

  const onSubmit = async (values: CompositionValues) => {
    await submit.mutateAsync(values)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='col-span-4'>
      <Input
        type='number'
        {...register('weight', {
          valueAsNumber: true
        })}
        label='Weight'
      />
      <Button type='submit' disabled={submit.isLoading}>
        {submit.isLoading ? 'Loading' : 'Add'}
      </Button>
    </form>
  )
}

const CompositionAction = () => {
  const { handleDialog } = useDialogStore()

  return (
    <Button
      onClick={() => {
        handleDialog({
          title: 'Track body composition',
          component: <CompositionForm />
        })
      }}
    >
      Add composition
    </Button>
  )
}

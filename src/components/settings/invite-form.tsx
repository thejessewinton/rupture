'use client'

import { useForm } from 'react-hook-form'
import { api } from '~/trpc/react'
import { type RouterInputs } from '~/trpc/shared'
import { Input } from '~/components/shared/input'
import { Button } from '~/components/shared/button'
import { toast } from 'sonner'

type Values = RouterInputs['teams']['sendInvite']

export const InviteForm = () => {
  const { register, handleSubmit, reset } = useForm<Values>({
    defaultValues: {
      email: ''
    }
  })

  const submit = api.teams.sendInvite.useMutation({
    onSuccess: async () => {
      reset()
      toast.success('Invite sent')
    }
  })

  const onSubmit = async (values: Values) => {
    await submit.mutateAsync(values)
  }

  return (
    <div className='w-full space-y-8'>
      <div className='space-y-1'>
        <h3 className='text-lg'>Team Settings</h3>
        <p className='text-sm text-neutral-500'>Invite a team member</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4 border-t border-neutral-600 pt-8'>
        <Input type='text' {...register('email')} label='Email' placeholder='eugene.debbs@socialist.com' />
        <Button type='submit' disabled={submit.isLoading}>
          {submit.isLoading ? 'Loading' : 'Update'}
        </Button>
      </form>
    </div>
  )
}

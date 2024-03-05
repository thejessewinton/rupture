'use client'

import { useForm } from 'react-hook-form'

import { useRouter } from 'next/navigation'
import { type RouterInputs } from '~/trpc/shared'
import { api } from '~/trpc/react'
import { Button } from '../shared/button'

type Values = RouterInputs['teams']['updateTeam']

export const TeamSettingsForm = () => {
  const { register, handleSubmit } = useForm<Values>({
    defaultValues: {
      name: '',
      slug: ''
    }
  })
  const router = useRouter()

  const submit = api.teams.updateTeam.useMutation({
    onSuccess: () => {
      router.push('/')
    }
  })

  const onSubmit = async (values: Values) => {
    await submit.mutateAsync(values)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-3'>
      <div className='border-b border-neutral-800 pb-4 pt-2'>
        <div className='relative flex flex-col gap-2'>
          <input
            className='h-fit w-full bg-transparent px-3 py-1.5 !text-lg font-light text-neutral-500 outline-none transition-all placeholder:text-neutral-500 read-only:cursor-not-allowed'
            placeholder='Enter a name for your team...'
            {...register('name')}
          />
        </div>
      </div>

      <div className='relative flex flex-col gap-2'>
        <input
          className='h-fit w-full bg-transparent px-3 py-1.5 font-light text-neutral-500 outline-none transition-all placeholder:text-neutral-500 read-only:cursor-not-allowed'
          placeholder='Enter a slug for your team...'
          {...register('slug')}
        />
      </div>

      <Button type='submit' disabled={submit.isLoading} className='ml-auto mr-0'>
        {submit.isLoading ? 'Loading' : 'Submit'}
      </Button>
    </form>
  )
}

'use client'

import { useForm } from 'react-hook-form'
import { api } from '~/trpc/react'
import { type RouterOutputs, type RouterInputs } from '~/trpc/shared'
import { Input } from '../shared/input'
import { Button } from '../shared/button'

type Values = RouterInputs['teams']['updateTeam']

export const TeamForm = ({ initialTeamData }: { initialTeamData: RouterOutputs['teams']['getCurrentTeam'] }) => {
  const utils = api.useUtils()
  const { data } = api.teams.getCurrentTeam.useQuery(undefined, { initialData: initialTeamData })

  const { register, handleSubmit } = useForm<Values>({
    defaultValues: {
      name: data!.name,
      slug: data!.slug
    }
  })

  const submit = api.teams.updateTeam.useMutation({
    onSuccess: async () => {
      await utils.teams.getCurrentTeam.invalidate()
    }
  })

  const onSubmit = async (values: Values) => {
    await submit.mutateAsync(values)
  }

  return (
    <div className='w-full space-y-8'>
      <div className='space-y-1'>
        <h3 className='text-lg'>Team Settings</h3>
        <p className='text-sm text-neutral-500'>Manage your Rupture team settings</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4 border-t border-neutral-600 pt-8'>
        <Input type='text' {...register('name')} label='Team Name' />
        <Input type='text' {...register('slug')} label='Slug' />
        <Button type='submit' disabled={submit.isLoading}>
          {submit.isLoading ? 'Loading' : 'Update'}
        </Button>
      </form>
    </div>
  )
}

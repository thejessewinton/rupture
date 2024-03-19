'use client'

import { useForm } from 'react-hook-form'

import { Button } from '~/components/shared/button'
import { Input } from '~/components/shared/input'
import { Select } from '~/components/shared/select'
import { useDialogStore } from '~/state/use-dialog-store'
import { api } from '~/trpc/react'
import { type RouterInputs } from '~/trpc/shared'

type NewLiftValues = RouterInputs['lifts']['createNew']

export const LiftForm = ({ lift }: { lift?: NewLiftValues }) => {
  const { register, handleSubmit, reset } = useForm<NewLiftValues>({
    defaultValues: lift ?? {
      name: '',
      personal_record: 0,
      unit: 'lbs'
    }
  })

  const { setDialogOpen } = useDialogStore()
  const utils = api.useUtils()

  const submit = api.lifts.createNew.useMutation({
    onMutate: async () => {
      reset()
      setDialogOpen(false)
    },
    onSuccess: async () => {
      await utils.lifts.getAll.invalidate()
    },
    onError: (error) => {
      console.error(error)
    }
  })

  const onSubmit = async (values: NewLiftValues) => {
    await submit.mutateAsync(values)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='flex flex-col gap-4 border-t border-neutral-200 pt-8 dark:border-neutral-800'
    >
      <Input placeholder='Name' label='Lift' required {...register('name')} />

      <div className='relative flex flex-col gap-2'>
        <div className='flex gap-2'>
          <label className='text-xs'>Personal Record</label>

          <p className='block text-xs text-neutral-500'>— Record your current PR</p>
        </div>
        <div className='flex overflow-hidden rounded transition-all focus-within:ring-1 focus-within:ring-blue-400'>
          <Input
            placeholder='PR'
            {...register('personal_record', {
              valueAsNumber: true
            })}
            required
            type='number'
            step={2.5}
            className='flex-1 rounded-r-none border-r-0 outline-none ring-0 focus:ring-0'
          />
          <Select
            {...register('unit')}
            className='rounded-l-none rounded-r-sm border-l-0 pl-2 outline-none ring-0 focus:ring-0'
          >
            <option value='lbs'>lbs</option>
            <option value='kgs'>kgs</option>
          </Select>
        </div>
      </div>

      <Button type='submit' disabled={submit.isLoading}>
        Create lift
      </Button>
    </form>
  )
}

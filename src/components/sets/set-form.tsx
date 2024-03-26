'use client'

import { useForm } from 'react-hook-form'

import { Button } from '~/components/shared/button'
import { Checkbox } from '~/components/shared/checkbox'
import { Input } from '~/components/shared/input'
import { useDialogStore } from '~/state/use-dialog-store'
import { api } from '~/trpc/react'
import { type RouterInputs, type RouterOutputs } from '~/trpc/shared'

type SetValues = RouterInputs['sets']['createNew']
type Lift = RouterOutputs['lifts']['getBySlug']

export const SetForm = ({ set, lift }: { set?: SetValues; lift: Lift }) => {
  const { setIsOpen } = useDialogStore()
  const { register, handleSubmit } = useForm<SetValues>({
    defaultValues: set ?? {
      date: new Date().toISOString().split('T')[0],
      reps: 0,
      weight: 0,
      lift_id: lift?.id,
      tracked: false
    }
  })

  const utils = api.useUtils()

  const submit = api.sets.createNew.useMutation({
    onSuccess: async () => {
      await utils.lifts.getBySlug.invalidate({ slug: lift!.slug })
      setIsOpen(false)
    },
    onError: (error) => {
      console.error(error)
    }
  })

  const onSubmit = async (values: SetValues) => {
    await submit.mutateAsync(values)
  }

  if (!lift) return null

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='flex flex-col gap-4 border-t border-neutral-200 pt-8 dark:border-neutral-800'
    >
      <div className='flex items-center justify-between gap-2'>
        <Input
          {...register('reps', {
            valueAsNumber: true
          })}
          label='Reps'
          required
          type='number'
          step={1}
        />
        <Input
          {...register('weight', {
            valueAsNumber: true
          })}
          label='Weight'
          required
          type='number'
          step={1}
        />
        <Input {...register('date')} label='Date' required type='date' step={1} />
      </div>
      <div className='flex items-center justify-between'>
        <Button type='submit' disabled={submit.isLoading}>
          Add set
        </Button>

        <Checkbox label='Track set' {...register('tracked')} />
      </div>
    </form>
  )
}

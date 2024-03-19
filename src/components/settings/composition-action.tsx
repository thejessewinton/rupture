import { useForm } from 'react-hook-form'

import { Button } from '~/components/shared/button'
import { Input } from '~/components/shared/input'
import { Select } from '~/components/shared/select'
import { useDialogStore } from '~/state/use-dialog-store'
import { api } from '~/trpc/react'
import { type RouterInputs } from '~/trpc/shared'

type CompositionValues = RouterInputs['user']['createComposition']

export const CompositionForm = () => {
  const { register, handleSubmit, reset } = useForm<CompositionValues>()
  const { setDialogOpen } = useDialogStore()

  const utils = api.useUtils()
  const submit = api.user.createComposition.useMutation({
    onSuccess: async () => {
      reset()
      setDialogOpen(false)
      await utils.user.getCurrent.invalidate()
    }
  })

  const onSubmit = async (values: CompositionValues) => {
    await submit.mutateAsync(values)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div className='relative flex flex-col gap-2'>
        <div className='flex gap-2'>
          <label className='text-xs'>Current weight</label>
        </div>
        <div className='flex overflow-hidden rounded transition-all focus-within:ring-1 focus-within:ring-blue-400'>
          <Input
            {...register('weight', {
              valueAsNumber: true
            })}
            required
            type='number'
            step={1}
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
        {submit.isLoading ? 'Loading' : 'Add'}
      </Button>
    </form>
  )
}

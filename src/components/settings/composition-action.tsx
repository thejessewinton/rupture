import { useForm } from 'react-hook-form'

import { useDialogStore } from '~/state/use-dialog-store'
import { api } from '~/trpc/react'
import { type RouterInputs } from '~/trpc/shared'
import { Button } from '../shared/button'
import { Input } from '../shared/input'

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

export const CompositionAction = () => {
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

'use client'

import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'

import { Button } from '~/components/shared/button'
import { Input } from '~/components/shared/input'

import { useDialogStore } from '~/state/use-dialog-store'
import { api } from '~/trpc/react'
import { RouterOutputs, type RouterInputs } from '~/trpc/shared'
import { Select } from '../shared/select'

type NewWorkoutValues = RouterInputs['workouts']['createNew']

export const WorkoutForm = () => {
  const { register, handleSubmit, reset } = useForm<NewWorkoutValues>({
    defaultValues: {
      name: ''
    }
  })

  const utils = api.useUtils()

  const submit = api.workouts.createNew.useMutation({
    onMutate: async (data) => {
      reset()
    },
    onSuccess: async () => {
      await utils.lifts.getAll.invalidate()
    },
    onError: (error) => {
      console.error(error)
    }
  })

  const onSubmit = async (values: NewWorkoutValues) => {
    await submit.mutateAsync(values)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='flex flex-col gap-4 border-t border-neutral-200 pt-8 dark:border-neutral-800'
    >
      <Input placeholder='Name' required {...register('name')} />

      <div className='flex overflow-hidden rounded-sm transition-all focus-within:ring-1 focus-within:ring-blue-400'>
        <Input
          placeholder='PR'
          {...register('personal_record')}
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

      <Button type='submit' disabled={submit.isLoading}>
        Create lift
      </Button>
    </form>
  )
}

type EditLiftValues = RouterInputs['lifts']['updatePersonalRecord']

export const EditLiftForm = ({ lift }: { lift: RouterOutputs['lifts']['getAll'][number] }) => {
  const { register, handleSubmit, reset } = useForm<RouterInputs['lifts']['updatePersonalRecord']>({
    defaultValues: {
      id: lift.id,
      personal_record: lift.personal_record.toString()
    }
  })

  const { handleDialogClose } = useDialogStore()
  const utils = api.useUtils()

  const submit = api.lifts.updatePersonalRecord.useMutation({
    onMutate: async (data) => {
      const previousLifts = utils.lifts.getAll.getData()

      if (previousLifts) {
        utils.lifts.getAll.setData(undefined, [
          ...previousLifts.map((l) => {
            if (l.id === lift.id) {
              return {
                ...l,
                personal_record: Number(data.personal_record)
              }
            }
            return l
          })
        ])
      }
      reset()
      handleDialogClose()
    },
    onSuccess: async () => {
      await utils.lifts.getAll.invalidate()
    },
    onError: (error) => {
      console.error(error)
    }
  })

  const onSubmit = async (values: EditLiftValues) => {
    await submit.mutateAsync({
      id: values.id,
      personal_record: values.personal_record.toString()
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4 pt-8'>
      <Input placeholder='PR' {...register('personal_record')} required type='number' step={2.5} />

      <Button type='submit' disabled={submit.isLoading}>
        Update lift
      </Button>
    </form>
  )
}

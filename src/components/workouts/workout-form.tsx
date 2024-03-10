'use client'

import { useSession } from 'next-auth/react'
import { useFieldArray, useForm } from 'react-hook-form'

import { Button } from '~/components/shared/button'
import { Input } from '~/components/shared/input'

import { useDialogStore } from '~/state/use-dialog-store'
import { api } from '~/trpc/react'
import { RouterOutputs, type RouterInputs } from '~/trpc/shared'

type NewWorkoutValues = RouterInputs['workouts']['createNew']

export const WorkoutForm = () => {
  const lifts = api.lifts.getAll.useQuery()
  const { register, handleSubmit, reset, control } = useForm<NewWorkoutValues>({
    defaultValues: {
      name: '',
      lift_ids: [],
      day: 'Saturday'
    }
  })

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control,
    name: 'lift_ids' as never
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
    console.log(values)
    await submit.mutateAsync(values)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='flex flex-col gap-4 border-t border-neutral-200 pt-8 dark:border-neutral-800'
    >
      <Input placeholder='Name' required {...register('name')} />

      {fields.map((field, index) => (
        <input key={field.id} {...register(`lift_ids.${index}` as const)} />
      ))}

      {lifts.data?.map((lift) => (
        <div key={lift.id} className='flex items-center gap-4'>
          <input
            type='checkbox'
            value={lift.id}
            onChange={(e) => {
              if (e.target.checked) {
                append(lift.id)
              } else {
                remove(lift.id)
              }
            }}
          />
          <label htmlFor={lift.id.toString()}>{lift.name}</label>
        </div>
      ))}

      <div className='flex overflow-hidden rounded-sm transition-all focus-within:ring-1 focus-within:ring-blue-400'></div>

      <Button type='submit' disabled={submit.isLoading}>
        Create workout
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

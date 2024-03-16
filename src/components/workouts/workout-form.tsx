'use client'

import { useSession } from 'next-auth/react'
import { useFieldArray, useForm } from 'react-hook-form'

import { Button } from '~/components/shared/button'
import { Input } from '~/components/shared/input'

import { useDialogStore } from '~/state/use-dialog-store'
import { api } from '~/trpc/react'
import { RouterOutputs, type RouterInputs } from '~/trpc/shared'
import { Select } from '../shared/select'
import { useRouter } from 'next/navigation'
import { days } from '~/server/db/schema'
import { useState } from 'react'
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/solid'

type NewWorkoutValues = RouterInputs['workouts']['createNew']

export const WorkoutForm = () => {
  const lifts = api.lifts.getAll.useQuery()
  const { register, handleSubmit, reset, control } = useForm<NewWorkoutValues>({
    defaultValues: {
      name: '',
      days: []
    }
  })

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control,
    name: 'days'
  })

  const utils = api.useUtils()

  const submit = api.workouts.createNew.useMutation({
    onMutate: async () => {
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
      className='flex animate-fade-in flex-col gap-4 border-t border-neutral-200 pt-8 dark:border-neutral-800'
    >
      <Input placeholder='Name' required {...register('name')} />

      {days.map((day) => (
        <>
          <div className='flex items-center justify-between pb-4'>
            <h1 className='text-md'>{day}</h1>
            <button type='button' onClick={() => append({ day, lifts: [] })}>
              <PlusIcon className='h-4 w-4' />
            </button>
          </div>

          {fields
            .filter((field) => field.day === day)
            .map((field, index) => (
              <>
                <div className='flex justify-between gap-2' key={field.id}>
                  <Select {...register(`days.${index}.lifts.${index}.id`)}>
                    <option disabled>Lift</option>
                    {lifts.data?.map((lift) => (
                      <option key={lift.id} value={lift.id}>
                        {lift.name}
                      </option>
                    ))}
                  </Select>
                  <Input
                    placeholder='Sets'
                    type='number'
                    step={1}
                    {...register(`days.${index}.lifts.${index}.sets`, {
                      valueAsNumber: true
                    })}
                  />
                  <Input
                    placeholder='Reps'
                    type='number'
                    step={1}
                    {...register(`days.${index}.lifts.${index}.reps`, {
                      valueAsNumber: true
                    })}
                  />
                  <Input
                    placeholder='Percentage'
                    type='number'
                    step={1}
                    {...register(`days.${index}.lifts.${index}.percentage`, {
                      valueAsNumber: true
                    })}
                  />

                  <button type='button' onClick={() => remove(index)}>
                    <XMarkIcon className='h-4 w-4' />
                  </button>
                </div>
              </>
            ))}
        </>
      ))}

      <Button type='submit' disabled={submit.isLoading}>
        Create workout
      </Button>
    </form>
  )
}

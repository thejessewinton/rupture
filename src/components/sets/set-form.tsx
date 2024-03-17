'use client'

import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'

import { Button } from '~/components/shared/button'
import { Input } from '~/components/shared/input'
import { useDialogStore } from '~/state/use-dialog-store'

import { api } from '~/trpc/react'
import { type RouterOutputs, type RouterInputs } from '~/trpc/shared'

type SetValues = RouterInputs['sets']['createNew']
type Lift = RouterOutputs['lifts']['getBySlug']

export const SetForm = ({ set, lift }: { set?: SetValues; lift: Lift }) => {
  const { data: session } = useSession()
  const { handleDialogClose } = useDialogStore()
  const { register, handleSubmit } = useForm<SetValues>({
    defaultValues: set ?? {
      date: new Date(),
      reps: 0,
      weight: 0,
      lift_id: lift?.id
    }
  })

  const utils = api.useUtils()

  const submit = api.sets.createNew.useMutation({
    onMutate: (data) => {
      const previousSets = utils.lifts.getBySlug.getData({
        slug: lift!.slug
      })

      if (previousSets) {
        utils.lifts.getBySlug.setData(
          {
            slug: lift!.slug
          },
          {
            ...previousSets,
            sets: [
              ...(previousSets.sets ?? []),
              {
                date: data.date,
                reps: data.reps,
                weight: data.weight,
                id: data.lift_id,
                lift_id: lift!.id,
                created_at: new Date(),
                updated_at: new Date(),
                unit: 'lbs',
                user_id: session!.user.id,
                lift: lift!
              }
            ]
          }
        )
      }
    },
    onSuccess: async () => {
      await utils.lifts.getBySlug.invalidate({ slug: lift!.slug })
      handleDialogClose()
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
      <Input
        {...register('date', {
          valueAsDate: true
        })}
        label='Date'
        required
        type='date'
        step={1}
      />

      <Button type='submit' disabled={submit.isLoading}>
        Add set
      </Button>
    </form>
  )
}

export const NewSetAction = ({ lift }: { lift: Lift }) => {
  const { handleDialog } = useDialogStore()
  return (
    <Button
      onClick={() => {
        handleDialog({
          title: `Add Set to ${lift?.name}`,
          component: <SetForm lift={lift} />
        })
      }}
    >
      Add set
    </Button>
  )
}

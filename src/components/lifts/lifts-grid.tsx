'use client'

import { api } from '~/trpc/react'
import { LiftCard } from './lift-card'
import { useDialogStore } from '~/state/use-dialog-store'
import { LiftForm } from './lift-form'
import { Button } from '../shared/button'
import { EmptyState } from '../actions/empty-state'

export const LiftsGrid = () => {
  const lifts = api.lifts.getAll.useQuery()

  if (!lifts.data) return null

  return (
    <>
      {!lifts.data.length ? (
        <EmptyState>
          <p className='text-gray-400'>You don't have any lifts yet.</p>
        </EmptyState>
      ) : (
        <div className='grid gap-2 md:grid-cols-3'>
          {lifts.data.map((lift) => (
            <LiftCard key={lift.id} lift={lift} />
          ))}
        </div>
      )}
    </>
  )
}

export const NewLiftAction = () => {
  const { handleDialog } = useDialogStore()
  return (
    <Button
      onClick={() => {
        handleDialog({
          title: 'Add lift',
          component: <LiftForm />
        })
      }}
    >
      Add lift
    </Button>
  )
}

'use client'

import { useDialogStore } from '~/state/use-dialog-store'
import { api } from '~/trpc/react'
import { EmptyState } from '../actions/empty-state'
import { Button } from '../shared/button'
import { LiftCard } from './lift-card'
import { LiftForm } from './lift-form'

export const LiftsGrid = () => {
  const lifts = api.lifts.getAll.useQuery()

  if (!lifts.data) return null

  return (
    <>
      {!lifts.data.length ? (
        <EmptyState>
          <p className='text-sm font-light text-gray-400'>{`You don't have any lifts yet.`}</p>
        </EmptyState>
      ) : (
        <div className='grid space-y-8'>
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

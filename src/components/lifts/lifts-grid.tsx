'use client'

import { EmptyState } from '~/components/actions/empty-state'
import { LiftCard } from '~/components/lifts/lift-card'
import { api } from '~/trpc/react'

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
        <div className='grid grid-cols-3 gap-4'>
          {lifts.data.map((lift) => (
            <LiftCard key={lift.id} lift={lift} />
          ))}
        </div>
      )}
    </>
  )
}

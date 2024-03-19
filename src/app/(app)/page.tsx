'use client'

import { LiftForm } from '~/components/lifts/lift-form'
import { LiftsGrid } from '~/components/lifts/lifts-grid'
import { Button } from '~/components/shared/button'
import { useDialogStore } from '~/state/use-dialog-store'

export default function LiftsPage() {
  const { handleDialog } = useDialogStore()

  return (
    <>
      <div className='flex items-center justify-between pb-4'>
        <h1 className='text-xl'>Lifts</h1>

        <Button
          onClick={() => {
            handleDialog({ component: <LiftForm />, title: 'Add lift' })
          }}
        >
          Add lift
        </Button>
      </div>
      <LiftsGrid />
    </>
  )
}

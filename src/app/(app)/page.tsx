'use client'

import { LiftForm } from '~/components/lifts/lift-form'
import { LiftsGrid } from '~/components/lifts/lifts-grid'
import { Button } from '~/components/shared/button'
import { Dialog } from '~/components/shared/dialog-v2'

export default function LiftsPage() {
  return (
    <>
      <div className='flex items-center justify-between pb-4'>
        <h1 className='text-xl'>Lifts</h1>
        <Dialog title='Add lift' trigger={<Button>Add lift</Button>} component={<LiftForm />} />
      </div>
      <LiftsGrid />
    </>
  )
}

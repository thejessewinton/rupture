import { Button } from '~/components/shared/button'
import { WorkoutsTable } from '~/components/workouts/workouts-table'

export default async function Home() {
  return (
    <>
      <div className='flex items-center justify-between pb-4'>
        <h1 className='text-xl'>Workouts</h1>
        <Button href='/workouts/new'>Add workout</Button>
      </div>
      <WorkoutsTable />
    </>
  )
}

import { Button } from '~/components/shared/button'
import { WorkoutTable } from '~/components/workouts/workout-table'

export default async function Home() {
  return (
    <>
      <div className='flex items-center justify-between pb-4'>
        <h1 className='text-xl'>Workouts</h1>
        <Button href='/new'>Add workout</Button>
      </div>
      <WorkoutTable />
    </>
  )
}

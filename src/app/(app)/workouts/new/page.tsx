import { NewLiftAction } from '~/components/lifts/lifts-table'
import { WorkoutForm } from '~/components/workouts/workout-form'

export default async function NewWorkoutPage() {
  return (
    <>
      <div className='flex items-center justify-between pb-4'>
        <h1 className='text-xl'>New Workout</h1>
        <NewLiftAction />
      </div>
      <WorkoutForm />
    </>
  )
}

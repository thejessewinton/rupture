import { WorkoutTable } from '~/components/workouts/workout-table'

type WorkoutPageParams = {
  params: {
    id: string
  }
}

export default function WorkoutPage({ params }: WorkoutPageParams) {
  return <WorkoutTable id={params.id} />
}

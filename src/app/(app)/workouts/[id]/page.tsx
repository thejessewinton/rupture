import { WorkoutTable } from '~/components/workouts/workout-table'

type WorkoutPageParams = {
  params: {
    id: string
  }
}

export default async function WorkoutPage({ params }: WorkoutPageParams) {
  return <WorkoutTable id={params.id} />
}

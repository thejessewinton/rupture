import { LiftsGrid, NewLiftAction } from '~/components/lifts/lifts-grid'

export default async function LiftsPage() {
  return (
    <>
      <div className='flex items-center justify-between pb-4'>
        <h1 className='text-xl'>Lifts</h1>
        <NewLiftAction />
      </div>
      <LiftsGrid />
    </>
  )
}

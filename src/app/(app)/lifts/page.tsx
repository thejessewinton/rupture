import { LiftsTable, NewLiftAction } from '~/components/lifts/lifts-table'

export default async function LiftsPage() {
  return (
    <>
      <div className='flex items-center justify-between pb-4'>
        <h1 className='text-xl'>Lifts</h1>
        <NewLiftAction />
      </div>
      <LiftsTable />
    </>
  )
}

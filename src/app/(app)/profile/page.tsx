'use client'

import { CompositionTable } from '~/components/composition/composition-table'
import { CompositionForm } from '~/components/settings/composition-action'
import { ProfileForm } from '~/components/settings/profile-form'
import SvgPlus from '~/components/svg/plus'
import { useDialogStore } from '~/state/use-dialog-store'
import { api } from '~/trpc/react'

export default function SettingsPage() {
  const { handleDialog } = useDialogStore()
  const { data, isLoading } = api.user.getCurrent.useQuery()

  if (isLoading || !data) return

  return (
    <div className='w-full gap-4 space-y-8'>
      <div className='space-y-1'>
        <h3 className='text-lg'>Profile</h3>
        <p className='text-sm text-neutral-500'>Manage your Rupture profile and progress</p>
      </div>
      <div className='grid gap-8 border-t border-neutral-200 pt-8 dark:border-neutral-800 md:grid-cols-12'>
        <ProfileForm user={data} />
        <div className='col-span-12 flex w-full flex-col gap-4 md:col-span-4'>
          <div className='flex items-center justify-between'>
            <span className='text-xs'>Composition</span>
            <button
              className='flex h-6 w-6 items-center justify-center rounded border border-neutral-200 p-1 outline-none transition-all hover:bg-neutral-50 focus:ring-2 focus:ring-blue-400 dark:border-neutral-800 dark:hover:bg-neutral-900'
              onClick={() => {
                handleDialog({ component: <CompositionForm />, title: 'Add composition' })
              }}
            >
              <SvgPlus className='h-4 w-4' />
            </button>
          </div>
          <CompositionTable compositions={data.compositions} />
        </div>
      </div>
    </div>
  )
}

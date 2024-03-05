import { type Metadata } from 'next'
import { cache } from 'react'
import { ProfileForm } from '~/components/settings/profile-form'
import { api } from '~/trpc/server'

export const metadata: Metadata = {
  title: 'Settings'
}

export default async function SettingsPage() {
  const cachedUserData = cache(async () => {
    return await api.user.getCurrent.query()
  })

  const user = await cachedUserData()

  return (
    <>
      <ProfileForm initialUserData={user} />
    </>
  )
}

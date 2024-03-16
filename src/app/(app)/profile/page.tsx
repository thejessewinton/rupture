import { type Metadata } from 'next'
import { ProfileForm } from '~/components/settings/profile-form'

export const metadata: Metadata = {
  title: 'Settings'
}

export default function SettingsPage() {
  return (
    <>
      <ProfileForm />
    </>
  )
}

import { type Metadata } from 'next'
import { InviteForm } from '~/components/settings/invite-form'

export const metadata: Metadata = {
  title: 'Team'
}

export default async function TeamSettingsPage() {
  return (
    <div>
      <InviteForm />
    </div>
  )
}

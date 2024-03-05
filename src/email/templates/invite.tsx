import { env } from '~/env'

type InviteProps = {
  firstName: string
  token: string
}

export const InviteTemplate = ({ firstName, token }: InviteProps) => {
  const url = new URL(env.NEXT_PUBLIC_APP_URL)
  url.searchParams.set('token', token)

  return (
    <div>
      <h1>Welcome, {firstName}!</h1>
      <a href={url.toString()}>Accept</a>
    </div>
  )
}

import { type Metadata } from 'next'
import { redirect } from 'next/navigation'

import { Button } from '~/components/shared/button'
import SvgDiscord from '~/components/svg/discord'
import SvgGoogle from '~/components/svg/google'
import { auth, signIn } from '~/server/auth'

export const metadata: Metadata = {
  title: 'Log In'
}

export default async function SignIn() {
  const session = await auth()

  if (session?.user) {
    redirect('/')
  }

  const providers = [
    {
      name: 'Google',
      icon: <SvgGoogle className='h-6 w-6 text-neutral-800 dark:text-white' />,
      action: async () => {
        'use server'
        await signIn('google')
      }
    },
    {
      name: 'Discord',
      icon: <SvgDiscord className='h-6 w-6 text-neutral-800 dark:text-white' />,
      action: async () => {
        'use server'
        await signIn('discord')
      }
    }
  ]

  return (
    <div className='flex h-screen w-screen items-center justify-center dark:bg-neutral-900'>
      <div className='w-full max-w-sm space-y-4 text-center'>
        <h1 className='text-xl'>Rupture</h1>
        {providers.map((provider) => (
          <form action={provider.action} className='w-full' key={provider.name}>
            <Button
              className='w-full bg-neutral-50 py-6 text-neutral-800 dark:bg-neutral-800 dark:text-white'
              icon={provider.icon}
            >
              Continue with {provider.name}
            </Button>
          </form>
        ))}
      </div>
    </div>
  )
}

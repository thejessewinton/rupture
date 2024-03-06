import { type Metadata } from 'next'
import { redirect } from 'next/navigation'

import { Button } from '~/components/shared/button'
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

  return (
    <div className='flex h-screen w-screen items-center justify-center bg-neutral-900'>
      <div className='w-full max-w-sm space-y-4 text-center'>
        <form
          action={async () => {
            'use server'
            await signIn('google')
          }}
          className='w-full'
        >
          <Button className='w-full !bg-neutral-800 !py-3 !text-white' icon={<SvgGoogle className='h-6 w-6' />}>
            Continue with Google
          </Button>
        </form>
      </div>
    </div>
  )
}

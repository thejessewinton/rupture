import { type Metadata } from 'next'
import { redirect } from 'next/navigation'

import { Button } from '~/components/shared/button'
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
      icon: (
        <svg
          width='32'
          height='32'
          viewBox='0 0 32 32'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className='h-6 w-6 text-neutral-800 dark:text-white'
        >
          <g clip-path='url(#clip0_312_2)'>
            <path
              d='M7.0216 13.0194C8.26505 9.25151 11.8059 6.54545 16 6.54545C18.2545 6.54545 20.2909 7.34545 21.8909 8.65455L26.5455 4C23.7091 1.52727 20.0727 0 16 0C9.69343 0 4.26367 3.59773 1.65332 8.8667L7.0216 13.0194Z'
              fill='currentColor'
            />
            <path
              d='M21.3877 24.0168C19.9346 24.9551 18.0881 25.4546 16 25.4546C11.822 25.4546 8.29217 22.7692 7.03599 19.0239L1.64996 23.1133C4.25707 28.3915 9.68668 32 16 32C19.9105 32 23.6471 30.6099 26.4456 27.9995L21.3877 24.0168Z'
              fill='currentColor'
            />
            <path
              d='M26.4456 27.9994C29.3722 25.2694 31.2727 21.2049 31.2727 16C31.2727 15.0545 31.1273 14.0363 30.9091 13.0909H16V19.2727H24.5818C24.1584 21.3515 23.0217 22.9616 21.3876 24.0168L26.4456 27.9994Z'
              fill='currentColor'
            />
            <path
              d='M7.03598 19.0238C6.71777 18.0751 6.54545 17.0583 6.54545 16C6.54545 14.9577 6.71258 13.9557 7.0216 13.0194L1.65332 8.8667C0.582116 11.0139 0 13.4338 0 16C0 18.5594 0.593041 20.9736 1.64995 23.1133L7.03598 19.0238Z'
              fill='currentColor'
            />
          </g>
          <defs>
            <clipPath id='clip0_312_2'>
              <rect width='32' height='32' fill='currentColor' />
            </clipPath>
          </defs>
        </svg>
      ),
      action: async () => {
        'use server'
        await signIn('google')
      }
    },
    {
      name: 'Discord',
      icon: (
        <svg
          width='32'
          height='25'
          viewBox='0 0 32 25'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className='h-6 w-6 text-neutral-800 dark:text-white'
        >
          <g clip-path='url(#clip0_1013_2)'>
            <path
              d='M27.1071 2.03115C25.0047 1.0686 22.7851 0.385736 20.5052 0C20.1933 0.557718 19.911 1.13153 19.6596 1.71905C17.231 1.3531 14.7614 1.3531 12.3328 1.71905C12.0813 1.1316 11.799 0.557785 11.4872 0C9.20579 0.388994 6.98482 1.07348 4.88027 2.03618C0.702194 8.21771 -0.430416 14.2457 0.135889 20.1881C2.58267 21.9959 5.32132 23.3708 8.23279 24.2529C8.88837 23.3712 9.46847 22.4358 9.96694 21.4567C9.02016 21.1031 8.10635 20.6668 7.23609 20.1529C7.46513 19.9868 7.68914 19.8156 7.90559 19.6495C10.4378 20.8404 13.2017 21.4578 16 21.4578C18.7983 21.4578 21.5621 20.8404 24.0944 19.6495C24.3133 19.8282 24.5373 19.9994 24.7639 20.1529C23.8919 20.6676 22.9764 21.1047 22.028 21.4592C22.5258 22.4379 23.106 23.3725 23.7621 24.2529C26.6761 23.3743 29.4168 22.0001 31.8641 20.1907C32.5285 13.2994 30.7289 7.32673 27.1071 2.03115ZM10.6843 16.5336C9.10616 16.5336 7.8024 15.1015 7.8024 13.3396C7.8024 11.5778 9.06085 10.1331 10.6792 10.1331C12.2976 10.1331 13.5913 11.5778 13.5636 13.3396C13.5359 15.1015 12.2926 16.5336 10.6843 16.5336ZM21.3157 16.5336C19.7351 16.5336 18.4363 15.1015 18.4363 13.3396C18.4363 11.5778 19.6948 10.1331 21.3157 10.1331C22.9366 10.1331 24.2202 11.5778 24.1925 13.3396C24.1648 15.1015 22.924 16.5336 21.3157 16.5336Z'
              fill='currentColor'
            />
          </g>
          <defs>
            <clipPath id='clip0_1013_2'>
              <rect width='32' height='24.2529' fill='currentColor' />
            </clipPath>
          </defs>
        </svg>
      ),
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

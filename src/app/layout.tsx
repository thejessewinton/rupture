import '~/styles/globals.css'

import { Inter, Roboto_Mono } from 'next/font/google'
import { cookies } from 'next/headers'

import { TRPCReactProvider } from '~/trpc/react'
import { classNames } from '~/utils/core'
import { ThemeProvider } from '~/providers/theme'
import { Dialog } from '~/components/shared/dialog'
import { SessionProvider } from '~/providers/session'
import { auth } from '~/server/auth'
import { type Metadata } from 'next'
import { Toaster } from '~/providers/toaster'
import { Header } from '~/components/layout/header'

export const metadata: Metadata = {
  title: {
    template: '%s · Rupture',
    default: 'Rupture'
  },
  icons: [{ rel: 'icon', url: '/favicon.ico' }]
}

const sansFont = Inter({
  variable: '--font-sans',
  display: 'swap',
  subsets: ['latin']
})

const monoFont = Roboto_Mono({
  variable: '--font-mono',
  display: 'swap',
  subsets: ['latin']
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  return (
    <html lang='en' suppressHydrationWarning>
      <body className={classNames('font-sans tracking-wide', sansFont.variable, monoFont.variable)}>
        <SessionProvider session={session}>
          <ThemeProvider>
            <TRPCReactProvider cookies={cookies().toString()}>
              <main className='flex min-h-screen w-full flex-row'>{children}</main>
              <Dialog />
              <Toaster
                position='bottom-right'
                toastOptions={{
                  duration: 5000
                }}
              />
            </TRPCReactProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}

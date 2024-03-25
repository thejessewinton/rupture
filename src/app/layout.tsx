import '~/styles/globals.css'

import { type ReactNode } from 'react'
import { type Metadata } from 'next'
import { Inter, Roboto_Mono } from 'next/font/google'
import { cookies } from 'next/headers'

import { Dialog } from '~/components/shared/dialog'
import { HotkeysProvider } from '~/providers/hotkeys'
import { SessionProvider } from '~/providers/session'
import { ThemeProvider } from '~/providers/theme'
import { TRPCReactProvider } from '~/trpc/react'

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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`bg-white bg-noise font-sans bg-blend-multiply dark:bg-neutral-900 ${sansFont.variable} ${monoFont.variable}`}
      >
        <SessionProvider>
          <ThemeProvider attribute='class'>
            <TRPCReactProvider cookies={cookies().toString()}>
              <main className='flex min-h-screen w-full flex-row'>{children}</main>
              <HotkeysProvider />
              <Dialog />
            </TRPCReactProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}

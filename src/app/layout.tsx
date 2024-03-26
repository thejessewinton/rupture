import '~/styles/globals.css'

import { type ReactNode } from 'react'
import { type Metadata } from 'next'
import { cookies } from 'next/headers'

import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'

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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`bg-white font-sans bg-blend-multiply dark:bg-neutral-900 ${GeistSans.variable} ${GeistMono.variable}`}
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

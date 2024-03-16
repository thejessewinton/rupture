import { DrizzleAdapter } from '@auth/drizzle-adapter'

import NextAuth, { type DefaultSession, type NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'
import Discord from 'next-auth/providers/discord'
import { db } from '~/server/db'

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string
    } & DefaultSession['user']
  }
}

export const config = {
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id
      }
    }),
    authorized({ auth }) {
      return !!auth?.user
    }
  },
  pages: {
    signIn: '/login',
    signOut: '/login'
  },
  adapter: DrizzleAdapter(db),
  providers: [Google, Discord]
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)

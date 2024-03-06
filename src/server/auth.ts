import { DrizzleAdapter } from '@auth/drizzle-adapter'

import NextAuth, { type DefaultSession, type NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'
import { db } from '~/server/db'
import { stripe } from '~/server/server'
import { slugify } from '~/utils/core'
import { users } from '~/server/db/schema'
import { eq } from 'drizzle-orm'

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string
    } & DefaultSession['user']
  }
}

export const config = {
  callbacks: {
    // @ts-expect-error types are bad
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
  providers: [Google],
  events: {
    createUser: async ({ user }) => {
      const newCustomer = await stripe.customers.create({
        name: user.name!,
        email: user.email!,
        metadata: {
          id: user.id!
        }
      })
    }
  }
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)

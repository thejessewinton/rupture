import { DrizzleAdapter } from '@auth/drizzle-adapter'

import NextAuth, { type DefaultSession, type NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'
import { db } from '~/server/db'
import { stripe } from '~/server/server'
import { members, team } from '~/server/db/schema'
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

      await db.transaction(async (tx) => {
        const newTeam = await tx.insert(team).values({
          name: user.name!,
          slug: slugify(user.name!),
          stripe_customer_id: newCustomer.id
        })

        await tx
          .update(users)
          .set({
            team_id: Number(newTeam.insertId)
          })
          .where(eq(users.id, user.id!))

        await tx.insert(members).values({
          team_id: Number(newTeam.insertId),
          user_id: user.id!,
          role: 'admin'
        })
      })
    }
  }
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)

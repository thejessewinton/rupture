import { initTRPC, TRPCError } from '@trpc/server'
import superjson from 'superjson'
import { ZodError } from 'zod'

import { db } from '~/server/db'
import { auth } from '~/server/auth'
import { eq } from 'drizzle-orm'
import { users } from '../db/schema'

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await auth()

  if (!session) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
    with: {
      membership: {
        with: {
          team: true
        }
      }
    }
  })

  return {
    db,
    session: {
      ...session,
      user: {
        ...user,
        membership: user!.membership,
        team: user!.membership.team
      }
    },
    ...opts
  }
}

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null
      }
    }
  }
})

export const createTRPCRouter = t.router

export const publicProcedure = t.procedure

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user }
    }
  })
})

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed)

import { TRPCError } from '@trpc/server'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { protectedProcedure, createTRPCRouter } from '~/server/api/trpc'
import { unit, units, users } from '~/server/db/schema'

export const userRouter = createTRPCRouter({
  getCurrent: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.session.user.id)
    })
  }),
  updateUser: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const emailCollisions = await ctx.db.query.users.findMany({
        where: eq(users.email, input.email)
      })

      if (emailCollisions.length > 0 && ctx.session.user.email !== input.email) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Email already in use'
        })
      }

      return await ctx.db.update(users).set(input).where(eq(users.id, ctx.session.user.id))
    }),
  getWeightUnit: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.unit.findFirst({
      where: eq(unit.user_id, ctx.session.user.id)
    })
  }),
  updateWeightUnit: protectedProcedure
    .input(
      z.object({
        value: z.enum(units)
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.db
        .insert(unit)
        .values({ value: input.value, user_id: ctx.session.user.id })
        .onConflictDoUpdate({
          target: unit.id,
          set: {
            value: input.value
          }
        })
    })
})

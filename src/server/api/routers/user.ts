import { TRPCError } from '@trpc/server'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'
import { composition, unit, units, users } from '~/server/db/schema'

export const userRouter = createTRPCRouter({
  getCurrent: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.session.user.id),
      with: {
        composition: true
      }
    })
  }),
  updateUser: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        weight: z.number().optional()
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
      return await ctx.db
        .update(users)
        .set({
          name: input.name,
          email: input.email
        })
        .where(eq(users.id, ctx.session.user.id))
    }),
  createComposition: protectedProcedure.input(z.object({ weight: z.number() })).mutation(async ({ input, ctx }) => {
    return await ctx.db.insert(composition).values({ weight: input.weight, user_id: ctx.session.user.id })
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

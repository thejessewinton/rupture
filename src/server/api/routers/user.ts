import { TRPCError } from '@trpc/server'
import { desc, eq } from 'drizzle-orm'
import { z } from 'zod'

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'
import { compositions, unit, units, users } from '~/server/db/schema'

export const userRouter = createTRPCRouter({
  getCurrent: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.session.user.id),
      with: {
        compositions: {
          limit: 5,
          orderBy: [desc(compositions.created_at)]
        }
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
  createComposition: protectedProcedure
    .input(z.object({ weight: z.number(), unit: z.enum(units), body_fat_percentage: z.number() }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.db
        .insert(compositions)
        .values({ weight: input.weight, body_fat_percentage: input.body_fat_percentage, user_id: ctx.session.user.id })
    }),
  deleteComposition: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input, ctx }) => {
    return await ctx.db.delete(compositions).where(eq(compositions.id, input.id))
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

import dayjs from 'dayjs'
import { desc, eq } from 'drizzle-orm'
import { z } from 'zod'

import { compositions, lift, set } from '~/server/db/schema'
import { createTRPCRouter, protectedProcedure } from '../trpc'

export const setsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.set.findMany({
      where: eq(lift.user_id, ctx.session.user.id),
      with: {
        lift: true
      }
    })
  }),
  createNew: protectedProcedure
    .input(
      z.object({
        reps: z.number(),
        weight: z.number(),
        lift_id: z.number(),
        date: z.string(),
        tracked: z.boolean().default(false),
        notes: z.string().max(255).optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (db) => {
        const [latestComposition] = await db.query.compositions.findMany({
          where: eq(compositions.user_id, ctx.session.user.id),
          orderBy: [desc(compositions.created_at)]
        })

        return await db.insert(set).values({
          user_id: ctx.session.user.id,
          reps: input.reps,
          weight: input.weight,
          lift_id: input.lift_id,
          date: dayjs(input.date).toDate(),
          tracked: input.tracked,
          composition_id: latestComposition?.id
        })
      })
    }),
  deleteSet: protectedProcedure
    .input(
      z.object({
        id: z.number()
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.delete(set).where(eq(set.id, input.id))
    })
})

import { createTRPCRouter, protectedProcedure } from '../trpc'
import { eq, and } from 'drizzle-orm'
import { z } from 'zod'
import { unit } from '~/server/db/schema'

export const workoutsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return {}
  }),
  getUnit: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.unit.findFirst({
      where: eq(unit.user_id, ctx.session.user.id)
    })
  }),
  getBySlug: protectedProcedure
    .input(
      z.object({
        slug: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      return {}
    })
})

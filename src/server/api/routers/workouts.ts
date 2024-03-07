import { createTRPCRouter, protectedProcedure } from '../trpc'
import { z } from 'zod'

export const workoutsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return {}
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

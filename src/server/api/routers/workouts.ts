import { lift, workout } from '~/server/db/schema'
import { createTRPCRouter, protectedProcedure } from '../trpc'
import { z } from 'zod'

export const workoutsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.workout.findMany({
      with: {
        lifts: true
      }
    })
  }),
  createNew: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        day: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
        lift_ids: z.array(z.number())
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (db) => {
        const newWorkout = await ctx.db.insert(workout).values({
          name: input.name,
          day: input.day,
          user_id: ctx.session.user.id
        })

        return newWorkout
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

import { lift, workout, exercise, days } from '~/server/db/schema'
import { createTRPCRouter, protectedProcedure } from '../trpc'
import { z } from 'zod'
import { eq } from 'drizzle-orm'

export const workoutsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.workout.findMany({
      with: {
        exercises: true
      }
    })
  }),
  createNew: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        days: z.array(
          z.object({
            day: z.enum(days),
            lifts: z.array(
              z.object({
                id: z.string(),
                sets: z.string(),
                reps: z.string(),
                percentage: z.string()
              })
            )
          })
        )
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (db) => {
        const [newWorkout] = await db
          .insert(workout)
          .values({
            name: input.name,
            user_id: ctx.session.user.id
          })
          .returning()

        for (const day of input.days) {
          for (const lift of day.lifts) {
            await db.insert(exercise).values({
              workout_id: newWorkout!.id,
              sets: Number(lift.sets),
              day: day.day,
              percentage: Number(lift.percentage),
              lift_id: Number(lift.id),
              reps: Number(lift.reps),
              user_id: ctx.session.user.id
            })
          }
        }

        return newWorkout
      })
    }),
  getById: protectedProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.workout.findFirst({
        where: eq(workout.id, Number(input.id)),
        with: {
          exercises: {
            with: {
              lift: true
            }
          }
        }
      })
    })
})

import { createTRPCRouter, protectedProcedure } from '../trpc'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { lift, units } from '~/server/db/schema'

export const liftsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.lift.findMany({
      where: eq(lift.user_id, ctx.session.user.id)
    })
  }),
  createNew: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        personal_record: z.number(),
        unit: z.enum(units)
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.insert(lift).values({
        name: input.name,
        user_id: ctx.session.user.id,
        personal_record: input.personal_record
      })
    }),
  updatePersonalRecord: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        personal_record: z.number()
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .update(lift)
        .set({
          personal_record: input.personal_record
        })
        .where(eq(lift.id, input.id))
    }),
  deleteLift: protectedProcedure
    .input(
      z.object({
        id: z.number()
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.delete(lift).where(eq(lift.id, input.id))
    })
})

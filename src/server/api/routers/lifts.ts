import { and, desc, eq } from 'drizzle-orm'
import { z } from 'zod'

import { lift, set, units } from '~/server/db/schema'
import { slugify } from '~/utils/core'
import { createTRPCRouter, protectedProcedure } from '../trpc'

export const liftsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.lift.findMany({
      where: eq(lift.user_id, ctx.session.user.id),
      orderBy: [desc(lift.created_at)],
      with: {
        sets: {
          orderBy: [desc(set.date)]
        }
      }
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
        personal_record: input.personal_record,
        slug: slugify(input.name)
      })
    }),
  getBySlug: protectedProcedure.input(z.object({ slug: z.string() })).query(async ({ ctx, input }) => {
    return await ctx.db.query.lift.findFirst({
      where: and(eq(lift.slug, input.slug), eq(lift.user_id, ctx.session.user.id)),
      with: {
        sets: {
          with: {
            lift: {
              columns: {
                slug: true
              }
            }
          }
        }
      }
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

import { and, desc, eq } from 'drizzle-orm'
import { z } from 'zod'

import { compositions, lift, set, units } from '~/server/db/schema'
import { slugify } from '~/utils/core'
import { createTRPCRouter, protectedProcedure } from '../trpc'

export const liftsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.lift.findMany({
      where: eq(lift.user_id, ctx.session.user.id),
      orderBy: [desc(lift.updated_at)],
      with: {
        sets: {
          orderBy: [desc(set.created_at)]
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
      await ctx.db.transaction(async (db) => {
        const [latestComposition] = await db.query.compositions.findMany({
          where: eq(compositions.user_id, ctx.session.user.id),
          orderBy: [desc(compositions.created_at)]
        })

        return await db.insert(lift).values({
          name: input.name,
          user_id: ctx.session.user.id,
          personal_record: input.personal_record,
          slug: slugify(input.name),
          composition_id: latestComposition?.id
        })
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
        },
        compositions: {
          columns: {
            weight: true
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

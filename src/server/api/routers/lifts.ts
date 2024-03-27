import { and, desc, eq } from 'drizzle-orm'
import { z } from 'zod'

import { compositions, lift, personalRecord, set, units } from '~/server/db/schema'
import dayjs from '~/utils/date'
import { createTRPCRouter, protectedProcedure } from '../trpc'

export const liftsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.lift.findMany({
      where: eq(lift.user_id, ctx.session.user.id),
      orderBy: [desc(lift.updated_at)],
      with: {
        sets: {
          orderBy: [desc(set.created_at)]
        },
        personal_records: {
          where({ lift_id, user_id }, { and, eq }) {
            return and(eq(personalRecord.lift_id, lift_id), eq(personalRecord.user_id, user_id))
          },
          orderBy: [desc(personalRecord.date)],
          columns: {
            weight: true
          }
        }
      }
    })
  }),
  createNew: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        weight: z.number(),
        unit: z.enum(units)
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (db) => {
        const [latestComposition] = await db.query.compositions.findMany({
          where: eq(compositions.user_id, ctx.session.user.id),
          orderBy: [desc(compositions.created_at)],
          limit: 1
        })

        const [newLift] = await db
          .insert(lift)
          .values({
            name: input.name,
            user_id: ctx.session.user.id,
            composition_id: latestComposition?.id
          })
          .returning({ id: lift.id })

        await db.insert(personalRecord).values({
          weight: input.weight,
          lift_id: newLift!.id,
          user_id: ctx.session.user.id
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
        },
        personal_records: {
          where({ lift_id, user_id }, { and, eq }) {
            return and(eq(personalRecord.lift_id, lift_id), eq(personalRecord.user_id, user_id))
          },
          orderBy: [desc(personalRecord.date)],
          columns: {
            weight: true,
            date: true
          }
        }
      }
    })
  }),
  updatePersonalRecord: protectedProcedure
    .input(
      z.object({
        lift_id: z.number(),
        weight: z.number(),
        date: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.insert(personalRecord).values({
        weight: input.weight,
        date: dayjs(input.date).toDate(),
        user_id: ctx.session.user.id,
        lift_id: input.lift_id
      })
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

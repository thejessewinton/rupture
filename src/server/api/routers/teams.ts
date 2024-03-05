import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'
import { slugify } from '~/utils/core'
import { apiKeys, invite, team, users } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { stripe } from '~/server/server'
import { randomBytes } from 'crypto'
import { email } from '~/email/client'
import { TRPCError } from '@trpc/server'
import { InviteTemplate } from '~/email/templates/invite'
import { nanoid } from 'nanoid'

export const teamRouter = createTRPCRouter({
  getCurrentTeam: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.team.findFirst({
      where: eq(team.id, ctx.session.user.membership.team_id),
      with: {
        api_key: true
      }
    })
  }),
  updateTeam: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        slug: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      await stripe.customers.update(ctx.session.user.team.stripe_customer_id!, {
        name: input.name
      })
      return await ctx.db
        .update(team)
        .set({
          name: input.name,
          slug: input.slug ?? slugify(input.name)
        })
        .where(eq(team.id, ctx.session.user.team.id))
    }),
  getApiKey: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.apiKeys.findFirst({
      where: eq(apiKeys.team_id, ctx.session.user.team.id)
    })
  }),
  generateApiKey: protectedProcedure.mutation(async ({ ctx }) => {
    const key = randomBytes(16).toString('hex')

    return await ctx.db.insert(apiKeys).values({
      team_id: ctx.session.user.team.id,
      key: key
    })
  }),
  deleteApiKey: protectedProcedure
    .input(
      z.object({
        id: z.number()
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.delete(apiKeys).where(eq(apiKeys.id, input.id))
    }),
  sendInvite: protectedProcedure
    .input(
      z.object({
        email: z.string().email()
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.transaction(async (db) => {
        const [userCollisions, inviteCollisions] = await Promise.all([
          db.query.users.findMany({
            where: eq(users.email, input.email)
          }),
          db.query.invite.findMany({
            where: eq(invite.email, input.email)
          })
        ])

        if (userCollisions.length > 0) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'User already exists'
          })
        }

        if (inviteCollisions.length > 0) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invite already sent to this email'
          })
        }

        const token = nanoid()
        await db.insert(invite).values({
          email: input.email,
          team_id: ctx.session.user.team.id,
          token
        })

        const { data, error } = await email.emails.send({
          from: 'Acme <hi@jessewinton.com>',
          to: [input.email],
          subject: 'Hello world',
          react: InviteTemplate({ firstName: 'John', token })
        })

        if (error) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: error.message
          })
        }

        return data
      })
    })
})

import { eq } from 'drizzle-orm'
import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import { users, waitlist } from '~/server/db/schema'

export const marketingRouter = createTRPCRouter({
  addNew: publicProcedure
    .input(
      z.object({
        email: z.string().email()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const emailCollisions = await ctx.db.query.waitlist.findMany({
        where: eq(users.email, input.email)
      })

      if (emailCollisions.length > 0) {
        return {
          message: 'Thanks for signing up! We will notify you when we launch.'
        }
      }

      await ctx.db.insert(waitlist).values({
        email: input.email
      })

      return {
        message: 'Thanks for signing up! We will notify you when we launch.'
      }
    })
})

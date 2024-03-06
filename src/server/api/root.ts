import { createTRPCRouter } from '~/server/api/trpc'
import { userRouter } from '~/server/api/routers/user'
import { workoutsRouter } from '~/server/api/routers/workouts'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  workouts: workoutsRouter
})

// export type definition of API
export type AppRouter = typeof appRouter

import { createTRPCRouter } from '~/server/api/trpc'
import { teamRouter } from '~/server/api/routers/teams'
import { userRouter } from '~/server/api/routers/user'
import { projectsRouter } from '~/server/api/routers/projects'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  teams: teamRouter,
  user: userRouter,
  projects: projectsRouter
})

// export type definition of API
export type AppRouter = typeof appRouter

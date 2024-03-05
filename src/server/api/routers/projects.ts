import { createTRPCRouter, protectedProcedure } from '../trpc'
import { cookie, domain, project } from '~/server/db/schema'
import { eq, and } from 'drizzle-orm'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import puppeteer from 'puppeteer'
import { slugify } from '~/utils/core'

export const projectsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.project.findMany({
      where: and(eq(project.team_id, ctx.session.user.team.id))
    })
  }),
  getBySlug: protectedProcedure
    .input(
      z.object({
        slug: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.project.findFirst({
        where: eq(project.slug, input.slug),
        with: {
          cookies: true,
          domain: {
            columns: {
              domain_name: true,
              is_verified: true
            }
          }
        }
      })
    }),
  createNew: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        domain_name: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (db) => {
        const exisitingProject = await db.query.project.findFirst({
          where: and(eq(project.name, input.name), eq(project.team_id, ctx.session.user.team.id))
        })

        if (exisitingProject) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Project already exists'
          })
        }

        const newProject = await db.insert(project).values({
          name: input.name,
          description: input.description,
          domain_name: input.domain_name,
          slug: slugify(input.name),
          team_id: ctx.session.user.team.id
        })
        const existingDomain = await db.query.domain.findFirst({
          where: and(eq(domain.domain_name, input.domain_name), eq(domain.team_id, ctx.session.user.team.id))
        })

        if (existingDomain) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Domain already exists'
          })
        }

        await db.insert(domain).values({
          domain_name: input.domain_name,
          team_id: ctx.session.user.team.id,
          project_id: Number(newProject.insertId)
        })
      })
    }),
  deleteProject: protectedProcedure
    .input(
      z.object({
        project_id: z.number()
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.delete(project).where(eq(project.id, input.project_id))
    }),
  scanForCookies: protectedProcedure
    .input(
      z.object({
        project_id: z.number(),
        domain_name: z.string()
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const browser = await puppeteer.launch({
          headless: 'new'
        })
        const page = await browser.newPage()

        const isVerified = await page.evaluate(() => {
          return true
          //return document.querySelector('meta[name="verification-token"]') !== null
        })

        if (!isVerified) {
          await browser.close()

          throw new TRPCError({
            code: 'PRECONDITION_FAILED',
            message: 'Domain is not verified'
          })
        }

        await page.goto(`https://${input.domain_name}`)

        await page.setRequestInterception(false)

        const cookies = await page.cookies()

        await browser.close()

        await ctx.db.transaction(async (db) => {
          await db.update(domain).set({ is_verified: isVerified }).where(eq(domain.domain_name, input.domain_name))
          await db.delete(cookie).where(eq(cookie.project_id, input.project_id))

          for (const cookieValue of cookies) {
            await db.insert(cookie).values({
              domain: cookieValue.domain,
              name: cookieValue.name,
              path: cookieValue.path,
              secure: cookieValue.secure,
              session: cookieValue.session,
              project_id: input.project_id
            })
          }

          return { success: true }
        })
      } catch (error) {
        console.error(error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Error fetching cookies'
        })
      }
    })
})

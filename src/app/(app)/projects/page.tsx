import { notFound } from 'next/navigation'
import { cache } from 'react'
import { TableView } from '~/components/projects/table-view'
import { api } from '~/trpc/server'

export default async function ProjectsPage() {
  const cachedProjects = cache(async () => {
    return await api.projects.getAll.query()
  })

  const projects = await cachedProjects()

  if (!projects) {
    notFound()
  }

  return <TableView projects={projects} />
}

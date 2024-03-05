import { cache } from 'react'
import { TableView } from '~/components/projects/table-view'
import { api } from '~/trpc/server'

export default async function Home() {
  const cachedProjects = cache(async () => {
    return await api.projects.getAll.query()
  })

  const projects = await cachedProjects()

  return <TableView projects={projects} />
}

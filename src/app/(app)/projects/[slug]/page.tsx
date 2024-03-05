import { notFound } from 'next/navigation'
import { cache } from 'react'
import { ProjectView } from '~/components/projects/project-view'
import { api } from '~/trpc/server'

type ProjectPageParams = {
  params: {
    slug: string
  }
}

export default async function ProjectPage({ params }: ProjectPageParams) {
  const cachedProject = cache(async () => {
    return await api.projects.getBySlug.query({ slug: params.slug })
  })

  const project = await cachedProject()

  if (!project) {
    notFound()
  }

  return <ProjectView project={project} />
}

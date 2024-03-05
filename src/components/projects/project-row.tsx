'use client'

import Link from 'next/link'
import { type RouterOutputs } from '~/trpc/shared'

export const ProjectRow = ({ job: project }: { job: RouterOutputs['projects']['getAll'][number] }) => {
  return (
    <div
      className='flex items-center justify-between py-4 pl-2 pr-4 only:border-b only:border-neutral-800 peer-checked:bg-stone-100'
      key={project.id}
    >
      <div className='group flex flex-1 items-center gap-2'>
        <div className='flex w-full items-center justify-between gap-4 text-xs'>
          <Link href={`/projects/${project.slug}`}>
            <h3>{project.name}</h3>
          </Link>
          <span className='text-neutral-500 dark:text-neutral-400'>{project.domain_name}</span>
        </div>
      </div>
    </div>
  )
}

'use client'

import { type RouterOutputs } from '~/trpc/shared'
import { api } from '~/trpc/react'
import Link from 'next/link'
import { Button } from '../shared/button'
import { useDialogStore } from '~/state/use-dialog-store'
import { NewProjectForm } from './new-project-form'

export const TableView = ({ projects }: { projects: RouterOutputs['projects']['getAll'] }) => {
  const { handleDialog } = useDialogStore()
  const { data } = api.projects.getAll.useQuery(undefined, {
    initialData: projects
  })

  return (
    <div>
      <Button
        onClick={() =>
          handleDialog({
            title: 'Add Project',
            component: <NewProjectForm />
          })
        }
      >
        Add Project
      </Button>
      <table className='min-w-full border-separate border-spacing-0 border-none text-left'>
        <thead className='h-8 rounded-md bg-neutral-800'>
          <tr>
            <th className='h-8 w-[300px] border-b border-t border-neutral-600 px-3 text-xs text-neutral-300 first:rounded-l-md first:border-l last:rounded-r-md last:border-r'>
              Domain name
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            {data.map((project) => (
              <td className='h-10 truncate border-b border-neutral-600 px-3 py-3 text-sm'>
                <Link className='group flex items-center gap-3' href={`/projects/${project.slug}`}>
                  <span className='border-slate-9 group-hover:border-blue-9 cursor-pointer transition duration-300 ease-in-out'>
                    {project.domain_name}
                  </span>
                </Link>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}

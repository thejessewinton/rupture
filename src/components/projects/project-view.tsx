'use client'

import { api } from '~/trpc/react'
import { type RouterOutputs } from '~/trpc/shared'
import { ScanCookies } from './scan-cookies'
import { Button } from '../shared/button'
import { useDialogStore } from '~/state/use-dialog-store'
import { DeleteConfirm } from './delete-confirm'

export const ProjectView = ({ project }: { project: NonNullable<RouterOutputs['projects']['getBySlug']> }) => {
  const { handleDialog } = useDialogStore()
  const { data } = api.projects.getBySlug.useQuery(
    {
      slug: project.slug
    },
    {
      initialData: project
    }
  )

  if (!data) {
    return null
  }

  return (
    <>
      <div className='mb-2 mt-8 flex flex-col justify-between gap-x-4 gap-y-2 lg:mb-4 lg:flex-row'>
        <div className='flex items-center gap-2 pr-4'>
          <h1 className='text-2xl font-medium'>{data.domain?.domain_name}</h1>
          {/* <Badge
            variant={data.domain?.is_verified ? 'default' : 'warning'}
            icon={
              data.domain?.is_verified ? (
                <CheckCircleIcon className='h-3 w-3' />
              ) : (
                <ExclamationCircleIcon className='h-3 w-3' />
              )
            }
          >
            {data.domain?.is_verified ? 'Verified' : 'Not Verified'}
          </Badge> */}
        </div>
        <Button
          onClick={() =>
            handleDialog({
              title: 'Delete Project',
              component: <DeleteConfirm id={project.id} />
            })
          }
        >
          Delete
        </Button>
        <ScanCookies slug={project.slug} domainName={project.domain!.domain_name} projectId={project.id} />
      </div>
      {data.cookies.map((cookie) => {
        return (
          <div key={cookie.id} className='overflow-scroll'>
            {cookie.name} - {cookie.domain} - {cookie.path}
          </div>
        )
      })}
    </>
  )
}

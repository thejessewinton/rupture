'use client'

import { useState } from 'react'
import { useDialogStore } from '~/state/use-dialog-store'
import { api } from '~/trpc/react'
import { Input } from '../shared/input'
import { Button } from '../shared/button'
import { useRouter } from 'next/navigation'

export const DeleteConfirm = ({ id }: { id: number }) => {
  const { handleDialogClose } = useDialogStore()
  const [disabled, setDisabled] = useState(true)
  const router = useRouter()

  const utils = api.useUtils()

  const deleteProject = api.projects.deleteProject.useMutation({
    onMutate: (data) => {
      router.push('/')
      handleDialogClose()
      const previousProjects = utils.projects.getAll.getData()
      const newProjects = previousProjects?.filter((project) => data.project_id !== project.id)
      utils.projects.getAll.setData(undefined, newProjects)
    }
  })

  return (
    <div>
      Are you sure you want to delete?
      <Input
        label='Type DELETE to confirm'
        secondaryLabel='This action cannot be undone'
        onChange={(e) => {
          if (e.target.value === 'DELETE') {
            setDisabled(false)
          } else {
            setDisabled(true)
          }
        }}
      />
      <Button disabled={disabled} onClick={() => deleteProject.mutate({ project_id: id })}>
        Delete
      </Button>
      <Button onClick={handleDialogClose}>Cancel</Button>
    </div>
  )
}

'use client'

import { useForm } from 'react-hook-form'

import { Button } from '~/components/shared/button'
import { Input } from '~/components/shared/input'

import { useDialogStore } from '~/state/use-dialog-store'
import { api } from '~/trpc/react'
import { type RouterInputs } from '~/trpc/shared'
import { slugify } from '~/utils/core'

type Values = RouterInputs['projects']['createNew']

export const NewProjectForm = () => {
  const { register, handleSubmit, reset } = useForm<Values>({
    defaultValues: {
      name: '',
      description: '',
      domain_name: ''
    }
  })

  const { handleDialogClose } = useDialogStore()
  const utils = api.useUtils()

  const submit = api.projects.createNew.useMutation({
    onMutate: async (data) => {
      const previousProjects = utils.projects.getAll.getData()!

      utils.projects.getAll.setData(undefined, [
        ...previousProjects,
        {
          ...data,
          team_id: Math.random(),
          id: Math.random(),
          slug: slugify(data.name),
          updated_at: new Date(),
          created_at: new Date()
        }
      ])
      reset()
      handleDialogClose()
    },
    onSuccess: async () => {
      await utils.projects.getAll.invalidate()
    },
    onError: (error) => {
      console.error(error)
    }
  })

  const onSubmit = async (values: Values) => {
    await submit.mutateAsync(values)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='relative flex w-full flex-col gap-3 font-sans'>
      <div className='border-b border-neutral-300 pb-2 dark:border-neutral-200 dark:border-neutral-800'>
        <div className='relative flex flex-col gap-2'>
          <Input
            className='border-none bg-transparent text-xl !ring-0'
            placeholder='Enter a name...'
            {...register('name')}
          />
          <Input
            className='border-none bg-transparent !ring-0'
            placeholder='Enter a domain...'
            {...register('domain_name')}
          />
        </div>
      </div>
      {/* 
      <Controller
        control={control}
        name='description'
        render={({ field }) => {
          return <MarkdownEditor placeholder='Enter a description...' {...field} />
        }}
      /> */}

      <div className='flex items-center justify-center gap-2 border-t border-neutral-300 pt-6 dark:border-neutral-200 dark:border-neutral-800'>
        <Button type='submit' disabled={submit.isLoading} className='ml-auto mr-0'>
          {submit.isLoading ? 'Loading' : 'Create project'}
        </Button>
      </div>
    </form>
  )
}

'use client'

import { useForm } from 'react-hook-form'
import { api } from '~/trpc/react'
import { type RouterOutputs } from '~/trpc/shared'

import { Button } from '~/components/shared/button'

import { useCopyToClipboard } from '~/hooks/use-copy-to-clipboard'
import { ClipboardDocumentCheckIcon, ClipboardDocumentIcon, TrashIcon } from '@heroicons/react/24/solid'

export const ApiKey = ({ initialTeamData }: { initialTeamData: RouterOutputs['teams']['getCurrentTeam'] }) => {
  const utils = api.useUtils()
  const { data } = api.teams.getCurrentTeam.useQuery(undefined, { initialData: initialTeamData })

  const { handleSubmit, reset } = useForm()

  const submit = api.teams.generateApiKey.useMutation({
    onSuccess: async () => {
      reset()
      await utils.teams.getCurrentTeam.invalidate()
    }
  })

  const onSubmit = async () => {
    await submit.mutateAsync()
  }

  return (
    <div className='mt-8 flex flex-col items-center justify-center gap-8'>
      <div className='w-full max-w-2xl space-y-8'>
        <div className='space-y-1'>
          <h3 className='text-lg'>API Key</h3>
          <p className='text-sm text-neutral-500'>Manage your Rupture API Key</p>
        </div>
        <div className='flex flex-col gap-4 border-t border-neutral-600 pt-8'>
          {data?.api_key ? (
            <div className='grid grid-cols-8 items-center gap-4 text-wrap bg-transparent'>
              <div className='col-span-7 flex-1 text-sm'>{data.api_key.key}</div>
              <div className='col-span-1 flex'>
                <CopyButton value={data.api_key.key} />
                <DeleteButton id={data.api_key.id} />
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-2'>
              <Button type='submit' disabled={submit.isLoading}>
                {submit.isLoading ? 'Loading' : 'Create API Key'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

const CopyButton = ({ value }: { value: string }) => {
  const { copy, copied } = useCopyToClipboard(value)

  return (
    <button
      onClick={copy}
      className='flex h-8 w-8 items-center justify-center rounded-l border border-neutral-800 bg-neutral-900'
    >
      {copied ? <ClipboardDocumentCheckIcon className='h-4 w-4' /> : <ClipboardDocumentIcon className='h-4 w-4' />}
    </button>
  )
}

const DeleteButton = ({ id }: { id: number }) => {
  const utils = api.useUtils()
  const deleteApiKey = api.teams.deleteApiKey.useMutation({
    onMutate: () => {
      utils.teams.getCurrentTeam.setData(undefined, undefined)
    },
    onSuccess: async () => {
      await utils.teams.getCurrentTeam.invalidate()
    }
  })

  return (
    <button
      onClick={() =>
        deleteApiKey.mutate({
          id
        })
      }
      className='flex h-8 w-8 items-center justify-center rounded-r border-y border-r border-neutral-800 bg-neutral-900'
    >
      <TrashIcon className='h-4 w-4' />
    </button>
  )
}

import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline'

import { DeleteConfirm } from '~/components/actions/delete-confirm'
import { Dropdown, DropdownItem } from '~/components/shared/dropdown'
import { useDialogStore } from '~/state/use-dialog-store'
import { api } from '~/trpc/react'
import { type RouterOutputs } from '~/trpc/shared'

type SetActionsProps = { set: NonNullable<RouterOutputs['lifts']['getBySlug']>['sets'][number] }

export const SetActions = ({ set }: SetActionsProps) => {
  const { setIsOpen, handleDialog } = useDialogStore()
  const utils = api.useUtils()

  const deleteSet = api.sets.deleteSet.useMutation({
    onMutate: (data) => {
      const previousSets = utils.lifts.getBySlug.getData({
        slug: set.lift!.slug
      })

      if (previousSets) {
        utils.lifts.getBySlug.setData(
          { slug: set.lift!.slug },
          {
            ...previousSets,
            sets: previousSets.sets.filter((s) => s.id !== data.id)
          }
        )
      }
      setIsOpen(false)
    },
    onSuccess: async () => {
      await utils.lifts.getBySlug.invalidate({ slug: set.lift!.slug })
    }
  })

  return (
    <Dropdown
      trigger={
        <button className='rounded p-1 outline-none transition-all hover:bg-neutral-50 focus:ring-2 focus:ring-blue-400 hover:dark:bg-neutral-800'>
          <EllipsisHorizontalIcon className='h-4 w-4' />
        </button>
      }
      align='end'
    >
      <DropdownItem>
        <button
          className='text-red-900 dark:text-red-500'
          onClick={() => {
            handleDialog({
              title: 'Delete lift',
              component: (
                <DeleteConfirm
                  title={`Are you sure you want to delete this set? This action cannot be undone.`}
                  onDelete={() => deleteSet.mutate({ id: set.id })}
                />
              )
            })
          }}
        >
          Delete set
        </button>
      </DropdownItem>
    </Dropdown>
  )
}

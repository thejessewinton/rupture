import { useDialogStore } from '~/state/use-dialog-store'
import { api } from '~/trpc/react'
import { RouterOutputs } from '~/trpc/shared'
import { Dropdown } from '../shared/dropdown'
import SvgEllipsis from '../svg/ellipsis'
import { DeleteConfirm } from '../actions/delete-confirm'

type SetActionsProps = { set: NonNullable<RouterOutputs['lifts']['getBySlug']>['sets'][number] }

export const SetActions = ({ set }: SetActionsProps) => {
  const { handleDialog, handleDialogClose } = useDialogStore()
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

      handleDialogClose()
    }
  })

  return (
    <Dropdown
      trigger={
        <button className='rounded-sm p-1 outline-none transition-all hover:bg-neutral-50 focus:ring-2 focus:ring-blue-400 hover:dark:bg-neutral-800'>
          <SvgEllipsis className='h-4 w-4' />
        </button>
      }
      align='end'
    >
      <Dropdown.Item>
        <button
          className='text-red-900 dark:text-red-500'
          onClick={() => {
            handleDialog({
              title: 'Delete set',
              component: (
                <DeleteConfirm
                  title={`Are you sure you want to delete this set?`}
                  onDelete={() => deleteSet.mutate({ id: set.id })}
                />
              )
            })
          }}
        >
          Delete set
        </button>
      </Dropdown.Item>
    </Dropdown>
  )
}

import { useDialogStore } from '~/state/use-dialog-store'
import { Button } from '~/components/shared/button'

type DeleteConfirmProps = {
  title: string
  onDelete: () => void
}

export const DeleteConfirm = ({ title, onDelete }: DeleteConfirmProps) => {
  const { handleDialogClose } = useDialogStore()

  return (
    <div className='mt-8 space-y-12'>
      <h3 className='text-sm'>{title}</h3>
      <div className='flex items-center gap-2'>
        <Button onClick={onDelete} variant='danger'>
          Delete
        </Button>
        <Button onClick={handleDialogClose}>Cancel</Button>
      </div>
    </div>
  )
}

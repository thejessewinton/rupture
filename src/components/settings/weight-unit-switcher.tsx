'use client'

import { api } from '~/trpc/react'
import { LabelSelect } from '../shared/label-select'

export const WeightUnitSwitcher = ({ className }: { className?: string }) => {
  const utils = api.useUtils()

  const { data } = api.workouts.getUnit.useQuery()

  const submit = api.user.updateWeightUnit.useMutation({
    onSuccess: async () => {
      await utils.user.getCurrent.invalidate()
    }
  })

  if (!data)
    return (
      <LabelSelect label='Weight Unit' name='weight-unit' defaultValue='lbs'>
        <option value='kgs'>KG</option>
        <option value='lbs'>LB</option>
      </LabelSelect>
    )

  return (
    <LabelSelect
      label='Weight Unit'
      name='weight-unit'
      defaultValue={data.value}
      onChange={async (e) => await submit.mutateAsync({ value: e.target.value as 'kgs' | 'lbs' })}
      className={className}
    >
      <option value='kgs'>KG</option>
      <option value='lbs'>LB</option>
    </LabelSelect>
  )
}

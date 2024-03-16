'use client'

import { api } from '~/trpc/react'
import { LabelSelect } from '../shared/label-select'
import { type units } from '~/server/db/schema'

export const WeightUnitSwitcher = ({ className }: { className?: string }) => {
  const utils = api.useUtils()

  const { data } = api.user.getWeightUnit.useQuery()

  const submit = api.user.updateWeightUnit.useMutation({
    onSuccess: async () => {
      await utils.user.getWeightUnit.invalidate()
    }
  })

  if (!data)
    return (
      <LabelSelect
        onChange={(e) => submit.mutate({ value: e.target.value as (typeof units)[number] })}
        label='Weight Unit'
        name='weight-unit'
        defaultValue='lbs'
      >
        <option value='kgs'>KG</option>
        <option value='lbs'>LB</option>
      </LabelSelect>
    )

  return (
    <LabelSelect
      label='Weight Unit'
      name='weight-unit'
      defaultValue={data.value}
      onChange={(e) => submit.mutate({ value: e.target.value as (typeof units)[number] })}
      className={className}
    >
      <option value='kgs'>KG</option>
      <option value='lbs'>LB</option>
    </LabelSelect>
  )
}

'use client'

import { useForm } from 'react-hook-form'
import { api } from '~/trpc/react'
import { RouterInputs } from '~/trpc/shared'
import { Select } from '../shared/select'

type DefaultValues = RouterInputs['user']['updateWeightUnit']

export const WeightUnitSwitcher = () => {
  const utils = api.useUtils()
  const { data } = api.user.getCurrent.useQuery(undefined)

  const { register, handleSubmit } = useForm<DefaultValues>({
    defaultValues: {
      weight_unit: data?.weight_unit!
    }
  })

  const submit = api.user.updateWeightUnit.useMutation({
    onSuccess: async () => {
      await utils.user.getCurrent.invalidate()
    }
  })

  const onSubmit = async (values: DefaultValues) => {
    await submit.mutateAsync(values)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} defaultValue={data?.weight_unit!}>
      <Select {...register('weight_unit')}>
        <option value='kgs'>KG</option>
        <option value='lbs'>LB</option>
      </Select>
    </form>
  )
}

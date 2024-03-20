import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

import { type RouterOutputs } from '~/trpc/shared'

export const classNames = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

export const slugify = (text: string) => {
  return text
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
}

export const getInitials = (name: string) => {
  const [firstName, lastName] = name.split(' ')
  return `${firstName![0]}${lastName![0]}`
}

export const getFirstInitial = (name: string) => {
  return name[0]
}

export const calculateWeight = ({
  weight,
  unit,
  convertTo
}: {
  weight: number
  unit: 'kgs' | 'lbs'
  convertTo: 'kgs' | 'lbs'
}) => {
  return unit === convertTo ? weight : unit === 'lbs' ? weight * 0.453592 : weight / 0.453592
}

export const getEstimatedMax = (set: { reps: number; weight: number }) => {
  if (set.reps <= 0) {
    return 0
  }

  return Math.round(set.weight * set.reps * 0.0333 + set.weight)
}

export const getLiftPercentageOfBodyWeight = ({ weight, lift }: { weight: number; lift: number }) => {
  return Math.round((lift / weight) * 100)
}

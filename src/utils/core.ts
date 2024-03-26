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

export const getPercentagesOfMax = (max: number) => {
  const percentages = [0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1, 1.1]
  return percentages.map((percentage) => {
    return {
      percentage: `${Math.round(percentage * 100)}%`,
      value: Math.round(max * percentage)
    }
  })
}

export const getAllTimeMax = (sets: NonNullable<RouterOutputs['lifts']['getBySlug']>['sets']) => {
  return Math.max(...sets.map((set) => getEstimatedMax(set)))
}

export const getWeightPercentageChange = ({ previous, current }: { previous?: number; current?: number }) => {
  if (!previous || !current) {
    return {
      percentage: 0,
      value: 0
    }
  }
  return {
    percentage: (((current - previous) / previous) * 100).toFixed(),
    value: current - previous
  }
}

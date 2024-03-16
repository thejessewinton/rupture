import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

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

export const estimatedMax = (set: { reps: number; weight: number }) => {
  if (+set.reps <= 0) {
    return 0
  }

  // Jim Wendler formula
  const estimatedMax = +set.weight * +set.reps * 0.0333 + +set.weight

  return Math.round(estimatedMax)
}

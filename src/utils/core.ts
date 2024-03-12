import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const classNames = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
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

export const convertToDecimal = (number: number) => {
  if (number <= 100) {
    return number / 100
  } else {
    return parseFloat((number / 100).toFixed(2))
  }
}

export const getPercentage = ({ weight, percentage }: { weight: number; percentage: number }) => {
  return weight * convertToDecimal(percentage)
}

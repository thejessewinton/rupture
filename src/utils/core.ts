import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { capitalize as c } from 'string-ts'

export const classNames = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

export const slugify = (string: string) => {
  return string
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
}

export const makePlural = (string: string, number: number) => {
  if (number === 1) {
    return string
  } else {
    return `${string}s`
  }
}

export const removeSpecialCharacters = (string: string) => {
  return string.replace(/[^a-zA-Z0-9]/g, ' ')
}

export const capitalize = (string: string) => {
  return c(removeSpecialCharacters(string.toLowerCase()))
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

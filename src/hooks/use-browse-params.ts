import { useSearchParams } from 'next/navigation'

export const useBrowseParams = () => {
  const params = useSearchParams()

  const years_experience = Number(params.get('years_experience'))
  const languages = params.get('languages')
  const frameworks = params.get('frameworks')
  const levels = params.get('levels')

  return {
    years_experience,
    languages,
    frameworks,
    levels
  }
}

import { useState, useCallback } from 'react'

export const useCopyToClipboard = (text: string) => {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(async () => {
    await navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    })
  }, [text])

  return { copied, copy }
}

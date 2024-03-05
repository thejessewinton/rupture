'use client'

import { api } from '~/trpc/react'
import { Button } from '../shared/button'
import { toast } from 'sonner'
import { useState } from 'react'

type ScanCookiesProps = {
  domainName: string
  slug: string
  projectId: number
}

export const ScanCookies = ({ domainName, slug, projectId }: ScanCookiesProps) => {
  const utils = api.useUtils()
  const [isScanning, setIsScanning] = useState(false)

  const scan = api.projects.scanForCookies.useMutation({
    onMutate: () => {
      setIsScanning(true)
    },
    onSuccess: async () => {
      setIsScanning(false)
      await utils.projects.getBySlug.invalidate({ slug })
      toast.success('Scan complete')
    },
    onError: (error) => {
      setIsScanning(false)
      toast.error(error.message)
    }
  })

  return (
    <>
      <Button
        onClick={() => {
          scan.mutate({ domain_name: domainName, project_id: projectId })
        }}
      >
        {!isScanning ? 'Scan' : 'Scanning'}
      </Button>
    </>
  )
}

import { type ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <div className='flex h-screen w-screen items-center justify-center'>{children}</div>
}

'use client'

import { useSearchParams } from 'next/navigation'

export default function Messages() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  
  return (
    error &&
      <p className="mt-4 text-sm text-red-500 text-center">
        {error}
      </p>
  );
}

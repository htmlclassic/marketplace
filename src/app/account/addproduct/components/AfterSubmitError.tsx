'use client'

import { useSearchParams } from 'next/navigation'

export default function AfterSubmitError() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  
  return (
    error &&
      <p className="text-sm text-red-500 text-center">
        {error}
      </p>
  );
}

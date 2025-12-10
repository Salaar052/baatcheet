import { LoaderIcon } from 'lucide-react'
import React from 'react'

function PageLoader() {
  return (
    <div className='h-screen flex items-center justify-center'>
        <LoaderIcon className='animate-spin text-black sixe-10' />
    </div>
  )
}

export default PageLoader
"use client"
import Upload from '@/components/upload/Upload'
import { SignedIn, SignedOut } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import React from 'react'

const Page = () => {
  const router = useRouter();
  return (
    <div>
        <SignedIn>
            <Upload />
        </SignedIn>
        <SignedOut>
            <div className='flex flex-col items-center justify-center h-screen'>
                <h1 className='text-2xl font-bold'>Please sign in to upload</h1>
                <button className='bg-blue-500 text-white p-2 rounded-md' onClick={() => router.push('/sign-in')}>Sign in</button>
            </div>
        </SignedOut>
    </div>
  )
}

export default Page;
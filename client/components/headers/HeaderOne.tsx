import Link from 'next/link'
import React from 'react'

export default function HeaderOne() {
  return (
    <div className="flex justify-between items-center py-4 px-10 shadow">
        <div>
          <Link href={'/'} className="text-xl text-red-500 font-extrabold tracking-wide">YouTube</Link>
        </div>
        <div className="flex space-x-4">
          <p>Home</p>
          <p>About</p>
          <p>Service</p>
        </div>
      </div>
  )
}

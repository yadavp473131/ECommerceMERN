// import { Outlet } from 'lucide-react'
import { Outlet } from 'react-router-dom'
import React from 'react'
import ShoppingHeader from './header'

export default function ShoppingLayout({showToast}) {
  return (
    <div className='flex flex-col bg-white overflow-hidden'>
      {/* common header component of shopping view */}
      <ShoppingHeader showToast={showToast}/>
      <main className='flex flex-col w-full'>
            <Outlet/>
      </main>
    </div>
  )
}

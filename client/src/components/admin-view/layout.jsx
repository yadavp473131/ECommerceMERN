import React,{ useState} from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from './sidebar'
import AdminHeader from './header'

export default function AdminLayout({showToast}) {
  const [openSidebar, setOpenSidebar] = useState(false);
  return (
    <div className='flex min-h-screen w-full'>
      {/* admin sidebar */}
      <AdminSidebar open={openSidebar} setOpen={setOpenSidebar}/>
      <div className='flex flex-1 flex-col'>
        {/* admin header */}
        <AdminHeader  setOpen={setOpenSidebar} showToast={showToast}/>
        <main className='flex-1 flex-col flex bg-muted p-4 md:p-6'>
            <Outlet />
        </main>
      </div>
    </div>
  )
}

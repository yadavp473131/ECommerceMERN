import React, { Fragment } from 'react'
import { ChartNoAxesCombined } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { LayoutDashboard, ShoppingBasket, ShoppingCart } from "lucide-react"
import { SheetContent, SheetHeader, Sheet, SheetTitle } from '../ui/sheet'


function MenuItems({setOpen}){

  const adminSidebarMenuItems = [
    {
        id:'dashboard',
        label : 'Dashboard',
        path: '/admin/dashboard',
        icon: <LayoutDashboard />
    },
    {
        id:'products',
        label : 'Products',
        path: '/admin/products',
        icon: <ShoppingBasket />
    },
    {
        id:'orders',
        label : 'Orders',
        path: '/admin/orders',
        icon: <ShoppingCart />
    }
   ]
   const navigate = useNavigate();
      return <nav className='mt-8 flex-col flex gap-2'>
        {
          adminSidebarMenuItems.map(menuItem => <div key={menuItem.id} onClick={()=>{
            navigate(menuItem.path)
            setOpen ? setOpen(false) :null
            } } className='flex items-center text-black cursor-pointer text-xl gap-2 rounded-md mx-3 py-2 text-muted-foreground hover:bg-amber-100 hover:text-fuchsia-500'>
           {menuItem.icon}
           <span>{menuItem.label}</span>
          </div>)
        }
      </nav>
}

export default function AdminSidebar({open, setOpen}) {

  const navigate = useNavigate();
  return <Fragment>
    <Sheet open={open} onOpenChange={setOpen} >
      <SheetContent side="left" className="w-64">
        <div className='flex flex-col h-full bg-white'>
          <SheetHeader className="border-b">
            <ChartNoAxesCombined className='text-black' size={30}/>
            <SheetTitle className='flex gap-2 text-black text-2xl mt-5 mb-5'>
              Admin Panel
            </SheetTitle>
          </SheetHeader>
          <MenuItems setOpen={setOpen}/>
        </div>
      </SheetContent>
    </Sheet>
    <aside className='hidden w-64 flex-col border-r bg-white p-6 lg:flex'>
      <div  onClick={()=>navigate('/admin/dashboard')} className='flex cursor-pointer items-center gap-2'>
        <ChartNoAxesCombined className='text-black' size={30}/>
        <h1 className='text-2xl text-black font-extrabold'>
          Admin Panel
        </h1>
      </div>
      <MenuItems />
    </aside>
  </Fragment>
}

import React from 'react'
import AdminOrdersView from '@/components/admin-view/orders'

export default function AdminOrders({showToast}) {
  return (
    <div>
      <AdminOrdersView showToast={showToast}/>
    </div>
  )
}

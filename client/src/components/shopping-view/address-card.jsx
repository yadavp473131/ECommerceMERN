import React from 'react'
import { Card, CardContent, CardFooter } from '../ui/card'
import { Button } from '../ui/button'

const AddressCard = ({addressInfo, handleDeleteAddress, handleEditAddress, setCurrentSelectedAddress, selectedId}) => {

  return (  <Card onClick={setCurrentSelectedAddress ? ()=>setCurrentSelectedAddress(addressInfo) : null}
              className={`cursor-pointer ${selectedId?._id === addressInfo?._id ? "border-red-900 border-[4px]": "border-black"}`} >
      <CardContent className={`${selectedId === addressInfo?._id ? "border-black": ''} grid p-4 gap-4`}>
         <div>Address: {addressInfo?.address}</div>
         <div>City: {addressInfo?.city}</div>
         <div>Pincode: {addressInfo?.pincode}</div>
         <div>Phone: {addressInfo?.phone}</div>
         <div>Notes: {addressInfo?.notes}</div>
      </CardContent>
      <CardFooter className="p-3 flex justify-between">
        <Button  onClick={()=>handleEditAddress(addressInfo)} className="bg-black text-white">Edit</Button>
        <Button onClick={()=>handleDeleteAddress(addressInfo)} className="bg-black text-white">Delete</Button>
      </CardFooter>
    </Card>
  )
}

export default AddressCard

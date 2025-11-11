import CommonForm from '@/components/common/form';
import { registerFormControls } from '@/config';
import { registerUser } from '@/store/auth-slice';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'

const initialState = {
  userName : '',
  email : '',
  password : '',
}

export default function AuthRegister({showToast}) {

  const [formData, setFormData] = useState(initialState); 
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function onSubmit(event){
   event.preventDefault();
  dispatch(registerUser(formData)).then((data)=>{
    // console.log(data);
    //registration successfull toast deprecated in  shadcn ui

    if(data?.payload?.success){
    // toast({
    //   title: data?.payload?.message
    // })
    showToast(data.payload.message, "success")
    }else{
    //  toast({
    //   title: data?.payload?.message,
    // variant: 'destructive'
    // })
    showToast(data?.payload?.message, "error");
    }
    navigate('/auth/login'); 
  });

  }
   

  return (
    <div className='mx-auto w-full max-w-md space-y-6'>
      <div className='text-center'>
        <h1 className='text-3xl font-bold tracking-tight'>Create new account</h1>
        <p className='mt-2'>Already have an account
          <Link to="/auth/login" className="font-medium ml-2 text-primary hover:underline" >Login</Link>
        </p>
      </div>
      <CommonForm
        formControls={registerFormControls}
        buttonText={'Sign Up'}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  )
  
    
    
}

'use client'
import Button from '@/app/components/Button'
import Input from '@/app/components/inputs/Input'
import React, { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import AuthSocialButton from './AuthSocialButton'
// import {BsGithub, BsGoogle} from "react-icons/bs"
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import axios from 'axios'
import toast from "react-hot-toast"
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

type Variant="LOGIN"|"REGISTER"



const AuthForm = () => {
    const[variant,setVariant]=useState<Variant>('LOGIN')
    const [loading,setLoading]=useState(false)
    const session = useSession()
    const router=useRouter()

    useEffect(()=>{
        if(session?.status=== 'authenticated'){
            router.push('/users')
        }
    },[session?.status,router])

    // a usecallback toggle function
    const toggleVariant=useCallback(()=>{
        if(variant==='LOGIN'){
            setVariant('REGISTER')
        }else{
            setVariant('LOGIN')
        }
    },[variant])


    // react-hook form
    const {
        register,
        handleSubmit,
        formState:{
            errors
        }
    }=useForm<FieldValues>(
        {
            defaultValues:{
                name:"",
                email:"",
                password:""
            }
        }
    )

    // submit function
    const onSubmit:SubmitHandler<FieldValues>=(data)=>{
setLoading(true);
if(variant=='REGISTER'){
    // axios register
    axios.post('/api/register',data)
    .then(()=>signIn('credentials',data))
    .catch(()=>toast.error('Something went wrong'))
    .finally(()=>setLoading(false))
}
if(variant=='LOGIN'){
    // nextauth sign in 
    signIn('credentials',{
        ...data,
        redirect:false
    }).then((callback)=>{
        if(callback?.error){
            toast.error('Invalid email or password')
        }
        if(callback?.ok && !callback?.error){
            toast.success('Logged In')
        }
    }).finally(()=>setLoading(false))
}
  
    }

    // using a social media to signup
    const socialAction=(action:string)=>{
        setLoading(true)
        // next auth social sign in
        signIn(action,{redirect:false})
        .then((callback)=>{
            if(callback?.error){
                toast.error('Invalid Credentials')
            }
            if(callback?.ok && !callback?.error){
                toast.success('Logged In')
                router.push('/users')
            }
        }).finally(()=>setLoading(false))
    }


  return (
    <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
<div className='bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10'>

{/* the input form  */}
    <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>

        {/* toggle the name input button */}
        {variant=='REGISTER' &&(
<Input label='Name' id='name' disabled={loading} errors={errors} register={register}/>
        )}
      
      <Input  disabled={loading} label='Email' id='email' type='email' errors={errors} register={register}/>
      <Input  disabled={loading} label='Password' id='password' type='password' errors={errors} register={register}/>

            {/* toggle the login/signup button */}
      <div>
        <Button disabled={loading} fullWidth type='submit' >
            {variant==='LOGIN' ? "SIGN IN" :" REGISTER"}
        </Button>
      </div>

    </form>

{/* sign in with socials */}
    <div className='mt-6'>

            <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                    <div className='w-full border-t border-gray-300'/>  
                </div>
                <div className='relative flex justify-center text-sm'>
                    <span className='bg-white px-2 text-gray.500'> Or continue with </span>
                </div>
            </div>

            <div className='mt-6 flex gap-2'>
                <AuthSocialButton onClick={()=>socialAction('github')} icon={FaGithub}/>
                <AuthSocialButton onClick={()=>socialAction('google')} icon={FcGoogle}/>
            </div>
    </div>

{/* toggle between signup and register page */}
<div className='flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500'>
<div>
    {variant==="LOGIN"? "New to Messenger?":"Already have an account?"}
</div>
<div onClick={toggleVariant} className='underline cursor-pointer'>
    {variant=="LOGIN"?'Create an Account':'Log in'}
</div>
</div>

</div>
    </div>
  )
}

export default AuthForm
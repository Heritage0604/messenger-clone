'use client'

import { UseFormRegister,FieldValues,FieldErrors } from "react-hook-form"


interface MessageInputProps{
    placeholder?:string
    id:string
    type?:string
    required:boolean
    register:UseFormRegister<FieldValues>
    errors:FieldErrors
}
const MessageInput:React.FC<MessageInputProps>=({placeholder,id,type,required,register,errors})=>{
    return(
        <div className='relative w-full lg:w-3/5 '>
            <input className='text-black font-light py-2 px-4 bg-neutral-100 w-full  rounded-lg focus:outline-none'
             placeholder={placeholder}   id={id} {...register(id,{required:required})} type={type} autoComplete={id}/>

        </div>
    )
}

export default MessageInput
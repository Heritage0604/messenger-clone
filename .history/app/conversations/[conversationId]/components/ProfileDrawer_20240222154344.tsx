'use client'
import useOtherUser from '@/app/hooks/useOtherUser'
import { Conversation,User } from '@prisma/client'
import {format} from "date-fns"
import { useMemo,Fragment,useState,useCallback } from 'react'
import {Transition,Dialog} from "@headlessui/react"
import {IoClose, IoTrash} from "react-icons/io5"
import  Avatar from "@/app/components/sidebar/Avatar"
import  AvatarGroup from "@/app/components/sidebar/AvatarGroup"
import  Modal from "@/app/components/Modal"
import ConfirmModal from './ConfirmModal'
import{useRouter} from "next/navigation"
import axios from 'axios'
import { useSession } from "next-auth/react";
import LoadingModal from "@/app/components/LoadingModal"
import useActiveList from '@/app/hooks/useActiveList';

interface ProfileDrawerProps{
    isOpen:boolean
    onClose:()=>void
    data:Conversation & {
        users:User[]
    }

}

const ProfileDrawer:React.FC<ProfileDrawerProps>=({isOpen,onClose,data})=>{

    const session = useSession();
    const currentUserEmail = session.data?.user?.email;
    const otherUser=useOtherUser(data)
    const[confirmOpen,setConfirmOpen]=useState(false)
    const [isLoading,setIsLoading]=useState(false)
    const router=useRouter()
    const joinedDate=useMemo(()=>{
        return format(new Date(otherUser.createdAt),'PP')
    },[otherUser.createdAt])


    const title=useMemo(()=>{
        return data.name||otherUser.name
    },[data.name,otherUser.name])

     const { members } = useActiveList();
  const isActive = members.indexOf(otherUser?.email!) !== -1;

  const statusText = useMemo(() => {
    if (data.isGroup) {
      return `${data.users.length} members`;
    }

    return isActive ? 'Active' : 'Offline'
  }, [data, isActive]);

const handleClick=useCallback((userId:string)=>{
       setIsLoading(true)
        axios.post('/api/conversations',{
            userId
        }).then((data)=>{
            router.push(`/conversations/${data.data.id}`)
            setIsLoading(false)
        })
    },[router])


    return(

        <>
         <ConfirmModal 
        isOpen={confirmOpen} 
        onClose={() => setConfirmOpen(false)}
      />

      
        {/* {isLoading && (
            <LoadingModal/>
        )} */}

      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
          <div className="fixed inset-0 bg-black bg-opacity-40" />
        </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                    <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                      <div className="px-4 sm:px-6">
                        <div className="flex items-start justify-end">
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                              onClick={onClose}
                            >
                              <span className="sr-only">Close panel</span>
                              <IoClose size={24} aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        <div className="flex flex-col items-center">
                          <div className="mb-2">
                            {data.isGroup ? <AvatarGroup users={data.users} /> : <Avatar user={otherUser} />}
                          </div>
                          <div>
                            {title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {statusText}
                          </div>
                          <div className="flex gap-10 my-8">
                            <div onClick={() => setConfirmOpen(true)} className="flex flex-col gap-3 items-center cursor-pointer hover:opacity-75">
                              <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center">
                                <IoTrash size={20} />
                              </div>
                              <div className="text-sm font-light text-neutral-600">
                                Delete
                              </div>
                            </div>
                          </div>
                        <div className="w-full pb-5 pt-5 sm:px-0 sm:pt-0">
                        <dl className="space-y-8 px-4 sm:space-y-6 sm:px-6">
                          {data.isGroup && (
                            <div>
                              <dt 
                                className="
                                  text-md
                                  font-medium 
                                  text-gray-500 
                                  sm:w-40 
                                  sm:flex-shrink-0
                                "
                              >
                                Group Participants
                              </dt>
                              <dd 
                                className="
                                  mt-1 
                                  text-sm 
                                  text-gray-900 
                                  sm:col-span-2
                                "
                              >
                                {data.users.map((user,index)=>{
                                    return(
                                      <div key={index} onClick={()=>handleClick(user.id)} className='group border-b-[1px] mb-2 flex cursor-pointer items-center'>
                                        {currentUserEmail!==user.email?(<Avatar user={user}/>):""}
                                        <h2 className=' ml-3 text-gray-400 group-hover:text-gray-500'>{currentUserEmail!==user.email?user.email:""}</h2>
                                         </div>
                                    )
                                })}
                                   
                              </dd>
                            </div>
                          )}
                          
                          {!data.isGroup && (
                            <div>
                              <dt 
                                className="
                                  text-sm 
                                  font-medium 
                                  text-gray-500 
                                  sm:w-40 
                                  sm:flex-shrink-0
                                "
                              >
                                Email
                              </dt>
                              <dd 
                                className="
                                  mt-1 
                                  text-sm 
                                  text-gray-900 
                                  sm:col-span-2
                                "
                              >
                                {otherUser.email}
                              </dd>
                            </div>
                          )}
                          {!data.isGroup && (
                            <>
                              <hr />
                              <div>
                                <dt 
                                  className="
                                    text-sm 
                                    font-medium 
                                    text-gray-500 
                                    sm:w-40 
                                    sm:flex-shrink-0
                                  "
                                >
                                  Joined
                                </dt>
                                <dd 
                                  className="
                                    mt-1 
                                    text-sm 
                                    text-gray-900 
                                    sm:col-span-2
                                  "
                                >
                                  <time dateTime={joinedDate}>
                                    {joinedDate}
                                  </time>
                                </dd>
                              </div>
                            </>
                          )}
                        </dl>
                      </div>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
        </>
    )
}

export default ProfileDrawer
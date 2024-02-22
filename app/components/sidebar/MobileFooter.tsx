'use client'

import useRoutes from '@/app/hooks/useRoute'
import useConversation from '@/app/hooks/useConversation'
import React from 'react'
import MobileItem from './MobileItem'

const MobileFooter = () => {
    const routes=useRoutes()
    const {isOpen} =useConversation()
    if(isOpen){
        return null
    }
  return (
    <div className="fixed justify-between w-full bottom-0 z-40 
    flex items-center bg-white lg:hidden p-2 border-t-[1px]">
        
        {routes.map((item)=>(
            <MobileItem key={item.label} icon={item.icon} href={item.href} label={item.label} onClick={item.onClick} active={item.active}/>
        ))}
    </div>
  )
}

export default MobileFooter
"use client"
import React, { useState } from 'react'
interface HamburgerProps{
  open: boolean
}
const Hamburger = ({open}:HamburgerProps) => {
  const [expanded, setExpanded] = useState<boolean>(false)
  const toggle = () => {
    setExpanded(prev => {
      const nextState = !prev;
      return nextState;
   })
  }
  return (
    <div
      tabIndex={0}
      aria-expanded={expanded}
      aria-label='Toggle menu'
      role='button'
      onClick={()=>toggle()}
      className='h-6 between flex-col z-102'>
<div className={`bg-white w-10 h-1 rounded-full transition duration-500 ${expanded?"rotate-45 translate-y-3":""}`}></div>
<div className={`bg-white w-10 h-1 rounded-full transition duration-500 ${expanded?"opacity-0":""}`}></div>
<div className={`bg-white w-10 h-1 rounded-full transition duration-500 ${expanded?"-rotate-45 -translate-y-2":""}`}></div>
    </div>
  )
}

export default Hamburger
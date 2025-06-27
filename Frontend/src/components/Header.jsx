import React from 'react'
import { GiBlackHoleBolas } from "react-icons/gi";
import { SlArrowDown } from "react-icons/sl";
const Header = () => {
  return (
<>
<div className='px-4 flex items-center justify-between h-[10%] bg-orange-500 rounded-r-2xl'>
        <div className='flex gap-2 items-center text-2xl'><GiBlackHoleBolas className='text-orange-500 rounded-lg bg-white'/>Vortex AI</div>
        <div className='material-round'><SlArrowDown className=' text-white'/></div>
      </div>
</>
  )
}

export default Header
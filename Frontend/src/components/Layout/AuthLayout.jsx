import React from 'react'

const AuthLayout = ({children}) => {
  return (
    <div className='p-6 w-screen h-screen text-lg bg-white relative'>
   <div className='flex gap-2'> <img src="./logo.png" className='w-16 h-12' alt="" /><span className='mt-2'>Expense Tracker</span>
    </div>
    {children}
    <div> <img src="./logo.png" className='w-32 h-26 absolute bottom-1 right-3 hidden md:block' alt="" /> </div>
    </div>

  )
}

export default AuthLayout
import React, { useState } from 'react'
import {FaRegEye,FaRegEyeSlash} from "react-icons/fa6";
const Input = ({value,onChange,placeholder,label,type}) => {
  const [showpassword,setshowPassword]=useState(false);
  const toggleshowpassword=()=>{
    setshowPassword(!showpassword);

  }
    return (
    <div>
        <label className='text-[13px] text-slate-800'>{label}</label>
        <div className="input-box">
            <input className='outline-none text-lg w-3/4'
            type={type=='password'?showpassword?'text':'password':type}
            placeholder={placeholder}
            value={value}
            onChange={(e)=>onChange(e)}
            />
            {type==='password' &&(
                <>
                {showpassword?
                 <FaRegEye 
                 size={22}
                 className='text-primary cursor-pointer'    
                onClick={()=>toggleshowpassword()}
                />
                :
                <FaRegEyeSlash
                 size={22}
                 className='text-slate-400 cursor-pointer'    
                onClick={()=>toggleshowpassword()}
                />
            }
                </>
            )
            }
        </div>
    </div>
  )
}

export default Input
import React from 'react'
import { MdArrowUpward } from "react-icons/md";
import { useRef } from 'react';
const Footer = ({chatHistory,SetchatHistory,generateBotresponse}) => {
  const inputref=useRef(null);
  const handlesubmit=(e)=>{
  e.preventDefault();
  const usermessage=inputref.current.value.trim();
  if(!usermessage)return;
  inputref.current.value="";
  SetchatHistory(history=>[...history,{role:'user',text:usermessage}]);
  setTimeout(() => {
    SetchatHistory(history=>[...history,{role:'model',text:'Thinking...'}]);
    generateBotresponse([...chatHistory,{role:'user',text:`using the details above, please address 
      this query: ${usermessage} or if above details is not matched with request then proceed with your own knowledge but make sure every respone is breif and better`}])
    
  }, 600);
}
  return (
    <>
    <form action="#" className='chat-form' onSubmit={handlesubmit}>
    <input ref={inputref} type='text' placeholder='Ask Vortex' className='input-box'/>
    <button className='rounded-full bg-orange-700 w-[10%] h-[100%] flex justify-center items-center'><MdArrowUpward className='text-3xl' /></button>
   </form></>
  )
}

export default Footer
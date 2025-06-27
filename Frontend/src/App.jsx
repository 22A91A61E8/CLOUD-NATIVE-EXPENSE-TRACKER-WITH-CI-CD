import { useEffect, useRef, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { GoHubot } from "react-icons/go"
import { SlArrowDown } from "react-icons/sl"
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom"
import OtpVerification from './components/Auth/OtpVerification'
import ChatMessage from './components/ChatMessage'
import Footer from './components/Footer'
import { Myinfo } from './components/Myinfo'
import UserProvider from './context/UserContext'
import Login from './pages/Auth/Login'
import Signup from './pages/Auth/Signup'
import Expense from './pages/Dashboard/Expense'
import Home from './pages/Dashboard/Home'
import Income from './pages/Dashboard/Income'
const App = () => {

const chatBodyref= useRef();
    const [chatVisible, setChatVisible] = useState(false);

    const [chatHistory,SetchatHistory]=useState([{
      hideInChat:true,
    role:"model",
    text:Myinfo
    }]);
    const updateHistory=(text)=>{
      // here the filter function actually removes thinking... and add response
      SetchatHistory(prev=>[...prev.filter(msg=>msg.text!=="Thinking..."),{role:"model",text}])
    }
    const generateBotresponse=async (history)=>{ 
    // console.log(history);
  history=history.map(({role,text})=>({role,parts:[{text}]}));
  //parts is used to send the different type of request such as image , text etc
  // stringyfy will convert the request into json string format
  const requestOptions={
    method:"POST",
    headers:{"content-type":"application/json"},
    body:JSON.stringify({contents:history})
    }
    try{
      //process.env for nodejs environment and  import.meta.env
      const response= await fetch(import.meta.env.VITE_API_KEY,requestOptions);
      console.log(response)
      console.log("🔍 VITE_API_KEY:", import.meta.env.VITE_API_KEY);

      const data=await response.json();
      if(!response.ok)throw new Error(data.error.message || "Something went Wrong!");
      console.log(data);
      const apiResponse=data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,"$1").trim();
      // console.log(apiResponse)
      updateHistory(apiResponse);
  //     /.../g — the slashes define the regex, and g is the global flag, meaning it will replace all matches, not just the first one.
  // \*\* — matches the literal **. The asterisk * is a special character in regex, so it needs to be escaped with a backslash (\*) to be treated as a literal.
  // (.*?) — a capturing group that:
  // . — matches any character except newlines.
  // * — means “zero or more times.”
  // ? — makes the * lazy, so it matches the smallest amount of text possible between the ** pairs (instead of the biggest).
  // \*\* — matches the closing **.
    }
    catch(error){
      console.log(error);
    }
    };

   useEffect(() => {
  if (chatVisible && chatBodyref.current) {
    chatBodyref.current.scrollTo({
      top: chatBodyref.current.scrollHeight,
      behavior: "smooth"
    });
  }
}, [chatHistory, chatVisible]);

  return (
<UserProvider>
  <div className='relative'>
  <Router>
    <Routes>
      <Route path='/' element={<Root/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/signup' element={<Signup />}/>
      <Route path="/verify-otp" element={<OtpVerification />} />
      <Route path='/dashboard' element={<Home/>}/>
      <Route path='/income' element={<Income/>}/>
      <Route path='/expense' element={<Expense/>}/>
    </Routes>
  </Router>

<div className="fixed bottom-0 right-0 mb-4 mr-4 z-50 flex flex-col items-end gap-2">
    {/* Toggle Button */}
    <button
      onClick={() => setChatVisible(prev => !prev)}
      className="bg-orange-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-orange-700 transition mb-2"
    >
      {chatVisible ? <div className='hidden'></div>: <GoHubot className='w-4 h-6 text-lg rounded-2xl' />}
    </button>

    {/* Chatbot UI */}
    {chatVisible && (
      <div className="relative z-50">
        <div className="box">
          {/* <Header /> */}
           <div className='px-4 flex items-center justify-between h-[10%] bg-orange-500 text-white font-light text-sm'>
        <div className='flex gap-2 items-center text-2xl'><GoHubot className='text-orange-500 rounded-lg bg-white'/>  Cortexa</div>
        <div className='material-round'><SlArrowDown className=' text-white' onClick={()=>{
          setChatVisible(prev => !prev);
        }}/></div>
      </div>

          <div ref={chatBodyref} className="msg-body flex-1 overflow-y-auto px-4 mb-10 bg-white">
            <div className="self-start flex gap-1 items-end">
              <GoHubot className="min-h-[2rem] min-w-[2rem] text-orange-600 rounded-lg text-3xl" />
              <div className="bot-msg">Hey there! How can I help you?</div>
            </div>
            {chatHistory.map((chat, index) => (
              <ChatMessage key={index} chat={chat} />
            ))}
          </div>
          <div className="footer">
            <Footer
              chatHistory={chatHistory}
              SetchatHistory={SetchatHistory}
              generateBotresponse={generateBotresponse}
            />
          </div>
        </div>
      </div>
    )}
  </div>

  </div>

<Toaster
toastOptions={{
className:"",
style: {
fontSize: '13px'
},
}}/>

</UserProvider>
  )
}

export default App

  const Root=()=>{
    const isAuthenicated=!!localStorage.getItem("token");
    return isAuthenicated?(<Navigate to="/dashboard"/>):(<Navigate to="/login" />);
    
  }
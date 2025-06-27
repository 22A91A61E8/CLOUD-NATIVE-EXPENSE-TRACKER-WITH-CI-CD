import React, { useContext, useState } from 'react'
import {Link, useNavigate} from "react-router-dom"
import AuthLayout from '../../components/Layout/AuthLayout'
import Input from '../../components/Inputs/Input'
import { validateEmail } from '../../utils/helper'
import { API_PATHS } from '../../utils/apiPath'
import axiosInstance from '../../utils/axiosInstance'
import { UserContext } from '../../context/UserContext'

const Login = () => {
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState("");
  const navigate=useNavigate();
  const {updateUser} = useContext(UserContext);
  const handleLogin= async (e)=>{
    // console.log("hello")
    e.preventDefault();
    if(!validateEmail(email)){
      setError("Please enter a valid email address ");
      return;
    }
    if(!password){
      setError("Please enter the password");
      return;
    }
    setError("");
    //Login API Call
try {
const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
email,
password,
});
const { token, user } = response.data;
if (token) {
console.log("Setting token in localStorage:", token);
localStorage.setItem("token", token);
console.log("Token should now be in localStorage.");
updateUser(user);
navigate("/dashboard");
}
} catch (error) {
if (error.response && error.response.data.message) {
setError(error.response.data.message);
} else {
setError("Something went wrong. Please try again.");
}
}
}
  return (
    <AuthLayout>
    <div className='flex justify-center items-center w-full h-[90vh]'>
      <div className='flex flex-col md:w-1/3 h-2/3 w-full'>
        <p>Welcome Back</p>
        <p>Please enter your details to login </p>
      <form onSubmit={handleLogin}>
       <Input 
       value={email}
        onChange={({target})=>setEmail(target.value)}
        label="Email Address"
        placeholder="john@example.com"
        type="text"
       />
        <Input 
       value={password}
        onChange={({target})=>setPassword(target.value)}
        label="Password"
        placeholder="Min 8 Characters"
        type="password"
       />
       {error && <p className='text-red-500 text-xs pd-2.5'>{error}</p> }
       <button type='submit' className='btn-primary'>LOGIN</button>
       <p className='text-[13px] text-slate-800 mt-3'>Don't have an account?{" "}
        <Link className="font-medium text-primary underline" to='/signup'>Signup</Link>
       </p>
      </form>

      </div>
    </div>

    </AuthLayout>
  )
}

export default Login
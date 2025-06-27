// components/Auth/OtpVerification.js
import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { UserContext } from "../../context/UserContext";

const OtpVerification = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { updateUser } = useContext(UserContext);

  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate("/signup"); // Redirect if no email was passed
    }
  }, [email, navigate]);

  const handleVerify = async () => {
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.VERIFY_OTP, {
        email,
        otp,
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      updateUser(user);

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed.");
    }
  };

  const handleResend = async () => {
    try {
      await axiosInstance.post(API_PATHS.AUTH.RESEND_OTP, { email });
      setInfo("OTP resent to your email.");
      setError("");
    } catch (err) {
      setError("Failed to resend OTP.");
      setInfo("");
    }
  };

  return (
    <div className="flex w-screen h-screen justify-center items-center">
    <div className="flex flex-col space-y-4 max-sm:w-full md:w-[30%]">
      <h2 className="text-lg font-display">Verify Your Email</h2>
      <input
        type="text"
        value={otp}
        placeholder="Enter 6 digit OTP verification Code"
        onChange={(e) => setOtp(e.target.value)}
        className="input outline-0 border-2 p-4 rounded-lg text-lg"
      />
      {error && <p className="text-red-500">{error}</p>}
      {info && <p className="text-green-600">{info}</p>}
      <button className="btn-primary" onClick={handleVerify}>
        Verify
      </button>
      {/* <button className="text-sm underline" onClick={handleResend}>
        Resend OTP
      </button> */}
    </div>
    </div>
  );
};

export default OtpVerification;

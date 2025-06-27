import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import AuthLayout from "../../components/Layout/AuthLayout";
import { UserContext } from "../../context/UserContext";
import { API_PATHS } from "../../utils/apiPath";
import axiosInstance from "../../utils/axiosInstance";
import { validateEmail } from "../../utils/helper";
import uploadImage from "../../utils/uploadImage";

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

 const handleSignUp = async (e) => {
  e.preventDefault();
  let profileImageUrl = "";

  if (!fullName) return setError("Please enter your name");
  if (!validateEmail(email)) return setError("Invalid email");
  if (!password) return setError("Enter password");

  setError("");

  try {
    if (profilePic) {
      const imgUploadRes = await uploadImage(profilePic);
      profileImageUrl = imgUploadRes.imageUrl || "";
    }

    const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
      fullName,
      email,
      password,
      profileImageUrl,
    });

    // ✅ FIX: Destructure user & token safely
    const { user, token } = response.data;

    if (!user.isEmailVerified) {
      navigate("/verify-otp", { state: { email } });
    } else {
      localStorage.setItem("token", token);
      updateUser(user);
      navigate("/dashboard");
    }

  } catch (error) {
    console.error("Signup error:", error);
    if (error.response && error.response.data) {
      setError(error.response.data.message + " - " + error.response.data.error);
    } else {
      setError("Something went wrong.");
    }
  }
};



  return (
    <AuthLayout>
      <div className="w-full h-[90%] md:h-full mt-10 flex justify-center items-center">
        <div className="md:w-2/5 sm:w-full flex flex-col">
          <h3 className="text-xl font-semibold text-black">Create an Account</h3>
          <p className="text-xs text-slate-700 mt-1 mb-6">
            Join us today by entering your details below.
          </p>
          <form onSubmit={handleSignUp}>
            <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
            <div className="md:grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                value={fullName}
                onChange={({ target }) => setFullName(target.value)}
                label="Full Name"
                placeholder="John"
                type="text"
              />
              <Input
                value={email}
                onChange={({ target }) => setEmail(target.value)}
                label="Email Address"
                placeholder="john@example.com"
                type="text"
              />
              <div className="col-span-2">
                <Input
                  value={password}
                  onChange={({ target }) => setPassword(target.value)}
                  label="Password"
                  placeholder="Min 8 Characters"
                  type="password"
                />
              </div>
            </div>
            {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
            <button type="submit" className="btn-primary">SIGN UP</button>
            <p className="text-sm text-slate-800 mt-3">
              Already have an account?{" "}
              <Link className="text-primary underline" to="/login">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignUp;

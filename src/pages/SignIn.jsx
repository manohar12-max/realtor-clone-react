import React from "react";
import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Link } from "react-router-dom";
import OAuth from "../components/OAuth";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate()
  const [showPass, setShowPass] = useState(false);
  const onSubmit=async (e)=>{
    if( !formData.email || !formData.password){
      toast.error("Please fill all the fields")
      return;
    }
    e.preventDefault();
    try{
      const auth = getAuth();
      const userCredential=await signInWithEmailAndPassword(auth, formData.email, formData.password)
    const user = userCredential.user;
    toast.success(`Welcome ${user.displayName}`)
    navigate("/")
    
    }
    catch(error){
      toast.error(error.message)
    }
  }
  return (
    <>
      <h1 className="text-3xl text-center mt-6 font-bold"> Sign In </h1>
      <div className="flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto ">
        <div className="md:w-[67%] lg:w-[50%] mb-12 md:mb-6">
          <img
            src="https://images.unsplash.com/flagged/photo-1564767609342-620cb19b2357?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8a2V5fGVufDB8fDB8fHww"
            alt="key"
            className="w-full rounded-2xl"
          />
        </div>
        <div className="w-full md:w-[67%] lg:w-[40%] lg:ml-20">
          <form onSubmit={onSubmit}>
            <input
              placeholder="Enter Email"
              className="w-full px-4 py-2 text-xl mb-6
              text-gray-700 bg-white rounded  border-gray-300 transition ease-in-out"
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
              }}
            />
            <div className="relative">
              <input
                placeholder="Enter Password"
                className="w-full px-4 py-2 text-xl mb-6
                text-gray-700 bg-white rounded  border-gray-300 transition ease-in-out"
                type={showPass ? "text" : "password"}
                id="password"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                }}
              />
              {showPass ? (
                <AiFillEye
                  className="absolute top-3 right-3 
                text-xl cursor-pointer"
                  onClick={() => {
                    setShowPass((prevState) => !prevState);
                  }}
                />
              ) : (
                <AiFillEyeInvisible
                  className="absolute top-3 
                right-3 text-xl cursor-pointer"
                  onClick={() => {
                    setShowPass((prevState) => !prevState);
                  }}
                />
              )}
            </div>
            <div className="mb-6 flex justify-between whitespace-nowrap text-sm sm:text-lg ">
              <p className="">
                Don't have account ?
                <Link
                  to="/sign-up"
                  className="text-red-600 hover:text-red-800 transition duration-200 ease-in-out ml-1"
                >
                  Register
                </Link>
              </p>
              <p>
                <Link
                  to="/forgot-password"
                  className="text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out ml-1"
                >
                  Forgot Password?
                </Link>
              </p>
            </div>
            <button
            className="w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-blue-700 transition duration-200 ease-in-out hover:shadow-lg active:bg-blue-800"
            type="submit"
          >
            Sign in
          </button>
          <div className=" flex  items-center my-4 before:border-t before:flex-1  before:border-gray-300 after:border-t after:flex-1  after:border-gray-300" >
            <p className="text-center font-semibold mx-4" >OR</p>
          </div>
          <OAuth/>
          </form>
          
        </div>
      </div>
    </>
  );
};

export default SignIn;

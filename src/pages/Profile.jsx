import React from 'react'
import { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { getAuth } from 'firebase/auth';
import { toast } from 'react-toastify';

const Profile = () => {
  const auth=getAuth();
  const [formData,setFormData]=useState({
    name:auth.currentUser.displayName,
    email:"",
  })
  const navigate = useNavigate();
  const onLogout=async ()=>{
    try {
      await auth.signOut();
      navigate("/");
    } catch (error) {
      toast.error(error);
    }
  }
  const {name,email} =formData;
  return (
    <>
    <section className='max-w-6xl flex flex-col justify-center items-center'>
      <h1 className='text-3xl text-center mt-6 font-bold'>My Profile</h1>
      <div className='w-full md:w-[50%] mt-6 px-3 '>
        <form >
        <input
              placeholder="Enter name"
              className="w-full px-4 py-2 text-xl mb-6
              text-gray-700 bg-white rounded  border-gray-300 transition ease-in-out"
              type="name"
              id="name" 
              value={name}
            />
            <input
              placeholder="Enter Email"
              className="w-full px-4 py-2 text-xl mb-6
              text-gray-700 bg-white rounded  border-gray-300 transition ease-in-out"
              type="name"
              id="name" 
              value={name}
            />
            <div className="mb-6 flex justify-between whitespace-nowrap text-sm sm:text-lg ">
              <p className="">
                Do you want to change your name?
                <Link
                  to="/sign-up"
                  className="text-red-600 hover:text-red-800 transition duration-200 ease-in-out ml-1"
                >
                  Edit
                </Link>
              </p>
              <p>
                <Link onClick={onLogout}
                  to="/forgot-password"
                  className="text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out ml-1"
                >
                  Sign out
                </Link>
              </p>
              <button
            className="w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-blue-700 transition duration-200 ease-in-out hover:shadow-lg active:bg-blue-800"
            type="submit"
          >
            Sign in
          </button>
            </div>
        </form>
      </div>
    </section>
    </>
  )
}

export default Profile

import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, updateProfile } from "firebase/auth";
import { toast } from "react-toastify";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const Profile = () => {
  const auth = getAuth();
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const [changeDetail, setChangeDetail] = useState(false);
  const navigate = useNavigate();
  const onLogout = async () => {
    try {
      await auth.signOut();
      navigate("/");
    } catch (error) {
      toast.error(error);
    }
  };
  const { name, email } = formData;
  const onSubmit=async ()=>{
    try{
      if(auth.currentUser.displayName != name){
        //update display name in firebase auth
        await updateProfile(auth.currentUser,{
          displayName:name
        })
        //update display name in firebase auth
        const docRef=doc(db,"users",auth.currentUser.uid)
        await updateDoc(docRef,{
          name
        })
      }
      toast.success("Profile updated successfully")
    }catch (error){
      toast.error(error);
    }
  }
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };
  return (
    <>
      <section className="max-w-6xl flex flex-col justify-center items-center">
        <h1 className="text-3xl text-center mt-6 font-bold">My Profile</h1>
        <div className="w-full md:w-[50%] mt-6 px-3 ">
          <form>
            <input
              placeholder="Enter name"
              className="w-full px-4 py-2 text-xl mb-6
              text-gray-700 bg-white rounded  border-gray-300 transition ease-in-out"
              type="text"
              id="name"
              value={name}
              disabled={!changeDetail}
              onChange={onChange}
            />
            <input
              placeholder="Enter Email"
              className="w-full px-4 py-2 text-xl mb-6
              text-gray-700 bg-white rounded  border-gray-300 transition ease-in-out"
              type="email"
              id="email"
              disabled
              value={email}
            />
            <div className="mb-6 flex justify-between whitespace-nowrap text-sm sm:text-lg ">
              <p className="">
                Do you want to change your name?
                <Link
                  onClick={() => {
                    changeDetail && onSubmit()
                    setChangeDetail(!changeDetail);
                  }}
                  className="text-red-600 hover:text-red-800 transition duration-200 ease-in-out ml-1"
                >
          
                  {changeDetail ? "Apply Change" : "Edit"}
                </Link>
              </p>
              <p>
                <Link
                  onClick={onLogout}
                  to="/forgot-password"
                  className="text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out ml-1"
                >
                  Sign out
                </Link>
              </p>
            </div>
            <button
              className="w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-blue-700 transition duration-200 ease-in-out hover:shadow-lg active:bg-blue-800"
              type="submit"
            >
              Sign in
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Profile;

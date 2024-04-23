import React from "react";
import { FcGoogle } from "react-icons/fc";
import {getAuth,signInWithPopup, GoogleAuthProvider, } from "firebase/auth";
import { toast } from "react-toastify";
import { doc, setDoc,getDoc, serverTimestamp} from "firebase/firestore";
import {db} from "../firebase"

import { useNavigate } from 'react-router-dom';
const OAuth = () => {
    const navigate = useNavigate()
    const onGoogleClick = async () => {
      try {
          const auth=getAuth();
          const provider = new GoogleAuthProvider();
         const userCred= await signInWithPopup(auth, provider)
         const user =userCred.user
        // check for the user is present or not
        const docRef=doc(db,"users",user.uid);
        const docSnapShot=await getDoc(docRef);
        if(!docSnapShot.exists()){
            await setDoc(docRef,{
                name:user.displayName,
                email:user.email,
                timestamp:serverTimestamp()
            })
        }
        navigate("/")
        toast.success(`Welcome ${user.displayName}`)
      }catch(err) {
        toast.error(err.message)
      }
    }
  return (
    <button type="button" onClick={onGoogleClick} className=" rounded flex items-center justify-center w-full bg-red-700 text-white px-7 py-3 uppercase hover:bg-red-800 active:bg-red-900 shadow-md active:shadow-lg hover:shadow-lg transition duration-150 ease-in-out">
      <FcGoogle  className="text-2xl bg-white rounded-full mr-2"/>
      Continue with Google
    </button>
  );
};

export default OAuth;

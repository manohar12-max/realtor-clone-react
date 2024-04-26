import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";
import Spinner from "./Spinner";
import { CgSpinner } from "react-icons/cg";
export default function Contact({ userRef, listing }) {
  const [message, setMessage] = useState("");
  const [landloard, setLandlord] = useState(null);
  
  useEffect(() => {
    async function getLandlord() {
      const doceRef = doc(db, "users", userRef);
      const docSnap = await getDoc(doceRef);
      if (docSnap.exists()) {
        setLandlord(docSnap.data());
      } else {
        toast.error("Couldn't find Landlord contact information");
      }
    }
    getLandlord();
  }, [userRef]);
  return (
    <div>
      {landloard == undefined ? (
        <CgSpinner className="w-full text-center" />
      ) : (
        <>
          <div className="">
            <p className="font-bold">
              Contact {landloard.name} for the {listing.name}
            </p>
          </div>
          <div className="mt-3 mb-6">
            <textarea
              placeholder="Enter your message"
              name="message"
              id="message"
              rows="2"
              value={message}
              onChange={(e)=>{setMessage(e.target.value)}} 
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"
            ></textarea>
          </div>
          <a href={`mailto:${landloard.email}?Subject=${listing.name}&body=${message}`}>
          <button  className="w-full text center transition duration-150 ease-in-out px-7 py-3 bg-blue-600 uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg text-white font-medium">
               Send Email to Landloard
              </button>
          </a>
          
        </>
      )}
    </div>
  );
}

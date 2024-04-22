import React from "react";
import { FcGoogle } from "react-icons/fc";

const OAuth = () => {
  return (
    <button className=" rounded flex items-center justify-center w-full bg-red-700 text-white px-7 py-3 uppercase hover:bg-red-800 active:bg-red-900 shadow-md active:shadow-lg hover:shadow-lg transition duration-150 ease-in-out">
      <FcGoogle  className="text-2xl bg-white rounded-full mr-2"/>
      Continue with Google
    </button>
  );
};

export default OAuth;

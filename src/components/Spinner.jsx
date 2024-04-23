import spinner from "../assets/svg/spinner.svg";
import React from "react";

const Spinner = () => {
  return (
    <div>
      <div className=" bg-black bg-opacity-50 flex items-center justify-center fixed left-0 right-0 bottom-0 top-0 z-50">
        <img src={spinner} className="h-24" alt="spinner" />
      </div>
    </div>
  );
};

export default Spinner;

import React, { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, updateProfile } from "firebase/auth";
import { toast } from "react-toastify";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { FcHome } from "react-icons/fc";
import ListingItem from "../components/ListingItem";
const Profile = () => {
  const auth = getAuth();
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const [changeDetail, setChangeDetail] = useState(false);
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
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
  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName != name) {
        //update display name in firebase auth
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
        //update display name in firebase auth
        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, {
          name,
        });
      }
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error);
    }
  };
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };
 async function onDelete(listId){
  try{
      if(window.confirm("Are you sure you want to delete")){
        await deleteDoc(doc(db, "listings", listId));
        const updatedListings =listings.filter((listing)=>listing.id != listId);
        setListings(updatedListings)
        toast.success("Listing deleted successfully")
      }
  }catch (error) {
    toast.error(error.message);
  }
 }
 function onEdit(listId){
  navigate(`/edit-listing/${listId}`);
 }


  useEffect(() => {
    async function fetchUserListings() {
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timeStamp", "desc")
      );
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    }
    fetchUserListings();
  }, [auth.currentUser.uid]);
  return (
    <>
      {console.log(listings)}
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
                    changeDetail && onSubmit();
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
              className=" w-full bg-blue-600
               text-white px-7 py-3 text-sm font-medium 
               uppercase rounded shadow-md
                hover:bg-blue-700 transition
                 duration-200 ease-in-out hover:shadow-lg
                   active:bg-blue-800 "
              type="submit"
            >
              <Link
                to="/create-listing"
                className="flex justify-center items-center"
              >
                <FcHome className="mr-2 text-2xl bg-red-200 rounded-full p-1 border-2" />
                Sell or rent your home
              </Link>
            </button>
          </form>
        </div>
      </section>
      <div>
        {!loading && listings.length > 0 && (
          <>
            <h2 className="text-2xl text-center font-semibold mb-6 mt-6">
              My Listings
            </h2>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5  gap-4 px-4">
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                  onDelete={() => {
                    onDelete(listing.id);
                  }}
                  onEdit={() => {
                    onEdit(listing.id);
                  }}
                />
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
};

export default Profile;

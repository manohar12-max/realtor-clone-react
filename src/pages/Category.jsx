import React from "react";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
  docs,
  startAfter,
} from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";
import ListingItem from "../components/ListingItem";
import Spinner from "../components/Spinner";
const Category = () => {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);
  const params = useParams();
  useEffect(() => {
    async function fetchListings() {
      try {
        const lisitngRef = collection(db, "listings");
        const q = query(lisitngRef, 
            where("type", "==", params.categoryName),
        orderBy("timeStamp","desc"),
    limit(8));
        const querySnap = await getDocs(q);
        const lastVisible=querySnap.docs[(querySnap.docs.length-1)]
        setLastFetchedListing(lastVisible);
        let listings = [];
        querySnap.forEach((doc) => {
            return listings.push({
              id: doc.id,
              data: doc.data(),
            });
        })
        setListings(listings);
      } catch (e) {
       
        toast.error(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchListings();
  },[params.categoryName]);

async function onFetchMoreListings(){
     
    try{
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("type", "==", params.categoryName),
        orderBy("timeStamp", "desc"),
        startAfter(lastFetchedListing),
        limit(4)
      );
      const querySnap = await getDocs(q);
      const lastVisible=querySnap.docs[(querySnap.docs.length-1)]
      setLastFetchedListing(lastVisible);
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({ data: doc.data(), id: doc.id });
      });
      setListings((prevstate)=>[...prevstate,...listings]);
    }catch(e){
      toast.error(e.message);
    }finally{
      setLoading(false);
    }
}

  if (loading &&!listings) {
    return <Spinner />
  }
  return (
    <div className="max-w-6xl mx-auto px-3">
      <h1 className="text-3xl text-center mt-6 font-bold mb-6 ">Places for {params.categoryName}</h1>
      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                />
              ))}
            </ul>
          </main>
          {
            lastFetchedListing && (
              <div className=" flex justify-center items-center">
                <button onClick={onFetchMoreListings} className='bg-white px-3 py-1.5 text-gray-700 border border-gray-300 mb-6 mt-6 rounded hover:border-slate-600' >Load More</button>
              </div>
            )
          }
        </>
      ) : (
        <p>There are no current offers</p>
      )}
    </div>
  );
};

export default Category;

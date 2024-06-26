import React from 'react'
import { useEffect,useState } from 'react';
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
  docs,
  startAfter
} from "firebase/firestore";
import { db } from '../firebase';
import { toast } from 'react-toastify';
import ListingItem from "../components/ListingItem"
import Spinner from "../components/Spinner"
const Offers = () => {
  const [offerListing, setOfferListing] = useState(null);
  const [loading, setLoading] = useState(true);
  // for load more button
  const [lastFetchedListing,setLastFetchedListing] = useState(null)
  useEffect(() => {
    async function getListing() {
      try {
        const listingRef = collection(db, "listings");
        const q = query(
          listingRef,
          where("offer", "==", true),
          orderBy("timeStamp", "desc"),
          limit(8)
        );
        const querySnap = await getDocs(q);
        const lastVisible=querySnap.docs[(querySnap.docs.length-1)]
        setLastFetchedListing(lastVisible);
        let listings = [];
        querySnap.forEach((doc) => {
          return listings.push({ data: doc.data(), id: doc.id });
        });
        setOfferListing(listings);
      } catch (error) {
        toast.error("No offers found");
      }finally{
        setLoading(false);
      }
    }

    getListing();
  }, []);
  async function onFetchMoreListings(){
    try {
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("offer", "==", true),
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
      setOfferListing((prevstate)=>[...prevstate,...listings]);
    } catch (error) {
      toast.error("No offers found");
    }finally{
      setLoading(false)
  }
}
  if (loading &&!offerListing) {
    return <Spinner />
  }
  return (
    <div className="max-w-6xl mx-auto px-3">
      <h1 className="text-3xl text-center mt-6 font-bold mb-6">Offers</h1>
      {loading ? (
        <Spinner />
      ) : offerListing && offerListing.length > 0 ? (
        <>
          <main>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {offerListing.map((listing) => (
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
}

export default Offers

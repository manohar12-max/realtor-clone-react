import { useEffect, useState } from "react";
import Slider from "../components/Slider";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import ListingItem from "../components/ListingItem";
const HomePage = () => {
  // Offers
  const [offerListing, setOfferListing] = useState(null);
  useEffect(() => {
    async function getListing() {
      try {
        const listingRef = collection(db, "listings");
        const q = query(
          listingRef,
          where("offer", "==", true),
          orderBy("timeStamp", "desc"),
          limit(4)
        );
        const querySnap = await getDocs(q);
        let listings = [];
        querySnap.forEach((doc) => {
          return listings.push({ data: doc.data(), id: doc.id });
        });
        setOfferListing(listings);
      } catch (error) {
        console.error("No offers found");
      }
    }

    getListing();
  }, []);

  // Rent
  const [rentListing, setRentListing] = useState(null);
  useEffect(() => {
    async function getListing() {
      try {
        const listingRef = collection(db, "listings");
        const q = query(
          listingRef,
          where("type", "==", "rent"),
          orderBy("timeStamp", "desc"),
          limit(4)
        );
        const querySnap = await getDocs(q);
        let listings = [];
        querySnap.forEach((doc) => {
          return listings.push({ data: doc.data(), id: doc.id });
        });
        setRentListing(listings);
      } catch (error) {
        console.error("No offers found");
      }
    }

    getListing();
  }, []);

   // Sale
   const [saleListing, setSaleListing] = useState(null);
   useEffect(() => {
     async function getListing() {
       try {
         const listingRef = collection(db, "listings");
         const q = query(
           listingRef,
           where("type", "==", "sale"),
           orderBy("timeStamp", "desc"),
           limit(4)
         );
         const querySnap = await getDocs(q);
         let listings = [];
         querySnap.forEach((doc) => {
           return listings.push({ data: doc.data(), id: doc.id });
         });
         setSaleListing(listings);
       } catch (error) {
         console.error("No offers found");
       }
     }
 
     getListing();
   }, []);
  return (
    <div>
     {console.log(saleListing)}
      <Slider />
      <div className="max-w-6xl p-4 mx-auto pt-4 space-y-6  ">
        {offerListing && offerListing.length > 0 && (
          <div className="m-2 mb-6">
            <h2 className="p-x3 text-2xl mt-6 font-semibold">Recent Offers</h2>
            <Link to="/offers">
              <p className="px-3 text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
                Show more offers
              </p>
            </Link>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5  gap-4 px-4">
              {offerListing.map((listing) => (
                <ListingItem 
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                />
              ))}
            </ul>
          </div>
        )}
         {rentListing && rentListing.length > 0 && (
          <div className="m-2 mb-6">
            <h2 className="p-x3 text-2xl mt-6 font-semibold">Places for rent </h2>
            <Link to="/category/rent">
              <p className="px-3 text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
                Show more places for rent
              </p>
            </Link>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5  gap-4 px-4">
              {rentListing.map((listing) => (
                <ListingItem 
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                />
              ))}
            </ul>
          </div>
        )}
        {saleListing && saleListing.length > 0 && (
          <div className="m-2 mb-6">
            <h2 className="p-x3 text-2xl mt-6 font-semibold">Places for Sale </h2>
            <Link to="/category/sale">
              <p className="px-3 text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
                Show more places for Sale
              </p>
            </Link>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5  gap-4 px-4">
              {saleListing.map((listing) => (
                <ListingItem 
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;

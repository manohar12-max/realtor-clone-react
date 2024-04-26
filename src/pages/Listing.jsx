import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { useParams } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { EffectFade, Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css/bundle";
import Spinner from "../components/Spinner";
import {
  FaBath,
  FaBed,
  FaChair,
  FaParking,
  FaShare,
  FaTable,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { MdLocationOn } from "react-icons/md";
import { getAuth } from "firebase/auth";
import Contact from "../components/Contact";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
const Listing = () => {
  const auth = getAuth();
  const position = [51.505, -0.09];
  const [contactLandlord, setContactLandlord] = useState(false);
  const [listingApp, setListingApp] = useState({});
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const [linkCopied, setLinkCopied] = useState(false);
  useEffect(() => {
    // setLoading(true);
    async function fetchListing() {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListingApp({ ...docSnap.data() });
        setLoading(false);
      }
    }
    fetchListing();
  }, [params.listingId]);
  if (loading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  return (
    <main>
      {console.log(listingApp.imagesUrls)}
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="fade"
        navigation
        pagination={{ clickable: true, type: "progressbar" }}
        autoplay={{ delay: 3000 }}
      >
        {listingApp.imagesUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              className="relative w-full overflow-hidden h-[300px]"
              style={{
                background: `url(${url}) center no-repeat`,
                backgroundSize: "cover",
              }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div
        className=" fixed  top-[13%] right-[3%] z-10
       bg-white cursor-pointer border-2 border-gray-400 rounded-full 
       w-10 h-10 flex justify-center items-center"
      >
        <FaShare
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            setLinkCopied(true);
            setTimeout(() => {
              setLinkCopied(false);
            }, 2000);
          }}
          className="text-xlg text-green-700"
        />
      </div>
      {linkCopied && (
        <span
          className="bg-blue-500 font-semibold
         text-white p-1 rounded text-xs
         fixed top-[120px] right-3 z-50"
        >
          Link Copied successfully
        </span>
      )}
      <div className="flex flex-col md:flex-row max-w-6xl lg:mx-auto p-4 rounded-lg shadow-lg bg-white md:space-x-5">
        <div className=" w-full">
          <p className="text-2xl font-bold mb-3 text-blue-900">
            {listingApp.name}-${" "}
            {listingApp.offer
              ? listingApp.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : listingApp.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {listingApp.type == "rent" && " /month"}
          </p>
          <div className="flex items-center space-x-1">
            <MdLocationOn className="h-4 w-4 text-green-600" />
            <p className="font-bold text-sm mb-[2px] text-gray-600 truncate">
              {listingApp.address}
            </p>
          </div>
          <div className=" flex justify-start items-center space-x-4 w-[75%] mt-2">
            <p className="bg-red-800 w-full max-w-[200px] rounded-md p-1 text-white text-center font-semibold shadow-md">
              {listingApp.type == "rent" ? "Rent" : "Sale"}
            </p>
            {listingApp.offer && (
              <p className="bg-green-800 w-full max-w-[200px] rounded-md p-1 text-white text-center font-semibold shadow-md">
                $ {+listingApp.regularPrice - +listingApp.discountedPrice}{" "}
                discount
              </p>
            )}
          </div>
          <div className=" mt-3 mb-3">
            <p className="">
              {" "}
              <span className="font-semibold"> Description- </span>{" "}
              {listingApp.description}{" "}
            </p>
            <ul className="flex  items-center space-x-10 text-sm font-semibold mb-2 ">
              <li className=" flex items-center whitespace-nowrap">
                <FaBed className="text-lg mr-1 " />
                {+listingApp.bedrooms > 1
                  ? `${listingApp.bedrooms} Beds`
                  : `${listingApp.bedrooms} Bed`}
              </li>
              <li className=" flex items-center whitespace-nowrap">
                <FaBath />
                {+listingApp.bathrooms > 1
                  ? `${listingApp.bathrooms} Baths`
                  : `${listingApp.bathrooms} Bath`}
              </li>
            </ul>
            <ul className="flex  items-center space-x-2 lg:space-x-10 text-sm font-semibold ">
              <li className=" flex items-center whitespace-nowrap">
                <FaParking />
                {listingApp.parking ? `Parking available` : `No parking spot`}
              </li>
              <li className=" flex items-center whitespace-nowrap">
                <FaChair />
                {listingApp.furnished ? `Furnished` : ""}
              </li>
            </ul>
          </div>
          {
            //incase if page loaded  first we might get error cause auth is still loading this can be avoided by adding ?
            listingApp.userRef !== auth.currentUser?.uid &&
              !contactLandlord && (
                <div className="mt-6">
                  <button
                    onClick={() => {
                      setContactLandlord(true);
                    }}
                    className="w-full text center transition duration-150 ease-in-out px-7 py-3 bg-blue-600 uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg text-white font-medium"
                  >
                    Contact Landloard
                  </button>
                </div>
              )
          }
          {contactLandlord && (
            <Contact userRef={listingApp.userRef} listing={listingApp} />
          )}
        </div>

        <div className=" w-full h-[200px] md:h-[400px] z-10 overflow-x-hidden mt-6 md:mt-0 md:ml-">
          <MapContainer center={[listingApp.geolocation.lat,listingApp.geolocation.lng]} zoom={13} scrollWheelZoom={false}
          style={ {height:"100%",width:"100%"}}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[listingApp.geolocation.lat,listingApp.geolocation.lng]}>
              <Popup>
                {listingApp.name} 
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </main>
  );
};

export default Listing;

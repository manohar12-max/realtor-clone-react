import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { useParams } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { EffectFade, Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css/bundle";
import Spinner from "../components/Spinner"
const Listing = () => {
  const [listingApp, setListingApp] = useState({});
  const [loading, setLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    // setLoading(true);
    async function fetchListing() {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListingApp({...docSnap.data()});
        setLoading(false);
      }
     
    }
    fetchListing();
  }, [params.listingId]);
  if (loading) {
    return(
      <div>
        <Spinner />
      </div>
    )
  }
 
  return (
    <main>
      {console.log(listingApp.imagesUrls) }
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="fade"
        navigation
        pagination={{ clickable: true, type: "progressbar" }}
        autoplay={{ delay: 3000 }}
      >
        { 
           listingApp.imagesUrls.map((url,index)=>(
            <SwiperSlide key={index}>
            <div
              className="relative w-full overflow-hidden h-[300px]"
              style={{
                background: `url(${url}) center no-repeat`,
                backgroundSize: "cover",
              }}
            ></div>
          </SwiperSlide>
         ))

        }
      </Swiper>
    </main>
  );
};

export default Listing;

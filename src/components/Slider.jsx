import React, { useEffect, useState } from 'react'
import { collection, doc, getDocs, limit, orderBy, query } from 'firebase/firestore'
import {db} from "../firebase"
import Spinner from"../components/Spinner"
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { EffectFade, Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css/bundle";
const Slider = () => {
    const [listings,setListings]=useState(null)
    const [loading,setloading]=useState(true)
    const navigate=useNavigate()
  useEffect(()=>{

    async function fetchListing(){
      const listingRef=collection(db, "listings")
      const q=query(listingRef,orderBy("timeStamp","desc"),limit(5))
      try{
        const querySnapshot=await getDocs(q)
      let listings=[]
      querySnapshot.forEach(doc=>{
       return  listings.push({data:doc.data(),id:doc.id})
      })
      setListings(listings)
      setloading(false)
      }
      catch(error){
        toast.error(error.message)
      }
    }
    fetchListing()
  },[])
  if(loading){
    return <Spinner/>
  }
  if(listings.length==0){
    return <h1>No listings found</h1>
  }
  return listings && <>
   <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="fade"
        navigation
        pagination={{ clickable: true, type: "progressbar" }}
        autoplay={{ delay: 3000 }}
      >
        {listings.map(({data,id}) => (
          <SwiperSlide key={id} onClick={()=>{navigate(`/category/${data.type}/${id}`)}}  >
            <div
              className="relative w-full overflow-hidden h-[300px]"
              style={{
                background: `url(${data.imagesUrls[0]}) center no-repeat`,
                backgroundSize: "cover",
              }}
            ></div>
            <p className="text-[#f1faee] absolute left-1 top-3
            font-medium max-w-[90%] bg-blue-700 shadow-lg opacity-90 rounded-br-3xl">{data.name}</p>
            <p className="text-[#f1faee] absolute left-1 bottom-1
            font-medium max-w-[90%] bg-orange-500 shadow-lg opacity-90 rounded-tr-3xl">
               ${data.discountedPrice ?? data.regularPrice}
                {data.type=="rent" && "/ month"}</p>
          </SwiperSlide>
        ))}
      </Swiper>
 
  
  </>
}

export default Slider

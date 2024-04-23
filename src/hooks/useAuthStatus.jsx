import React, { useEffect ,useState} from 'react'
import { getAuth,onAuthStateChanged } from 'firebase/auth'
export default function useAuthStatus() {
    const [loggedIn, setLoggedIn] =useState(false)
    //we will wait till we get info 
    const [checkingStatus,setCheckingStatus]=useState(true)
      useEffect(()=>{
        const auth=getAuth()
        onAuthStateChanged(auth,(user)=>{
            if(user){
                setLoggedIn(true)
            }else{
                setLoggedIn(false)
            }
            setCheckingStatus(false)
        })
      },[])
  return {loggedIn,checkingStatus}
}

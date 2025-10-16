import React, { useState } from "react";
import { assets, cities } from "../assets/assets";
import { useAppContext } from "../context/ApiContext";
import toast from "react-hot-toast";

const HotelReg = () => {

  const {setShowHotelRegister,axios,getToken,setIsOwner}=useAppContext()

  const[name,setName]=useState("")
  const[contact,setContact]=useState("")
  const[address,setAddress]=useState("")
  const[city,setCity]=useState("")
 
  const handleSubmit=async(event)=>{
    try {
      event.preventDefault();
      const{data}=await axios.post("/api/hotels",{name,contact,address,city},{
        headers:{
          Authorization:`Bearer ${await getToken()}`
        }
      })
      if(data.success){
        toast.success(data.message)
        setIsOwner(true)
        setShowHotelRegister(false)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
      
    }

  }

  return (
    <div onClick={()=>setShowHotelRegister(false)} className="fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center justify-center bg-black/70">
      <form className="flex bg-white rounded-xl max-w-4xl max-md:mx-2"
      onClick={(e)=>e.stopPropagation()}
      onSubmit={handleSubmit}
      >
        {/* left image */}
        <img
          src={assets.regImage}
          alt="regImage"
          className="w-1/2 rounded-xl hidden md:block"

          
        />
        <div className="relative flex flex-col items-center md:w-1/2 p-8 md:p-10">
          <img
            src={assets.closeIcon}
            alt="closeIcon"
            className="absolute top-4 right-4 h-4 w-4 cursor-pointer"
            onClick={()=>setShowHotelRegister(false)}
          />
          <p className="font-semibold text-2xl mt-6">Register your hotel</p>

          {/* hotel name */}
          <div className="w-full mt-5">
            <label htmlFor="name" className="font-medium text-gray-500">
              Hotel Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Type Here"
              className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-200 font-light"
              required
              value={name}
              onChange={(e)=>setName(e.target.value)}
            />
          </div>

          <div className="w-full mt-5">
            <label htmlFor="contact" className="font-medium text-gray-500">
              Phone
            </label>
            <input
              type="text"
              id="contact"
              placeholder="Type Here"
              className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-200 font-light"
              required
              value={contact}
              onChange={(e)=>setContact(e.target.value)}
            />
          </div>

          <div className="w-full mt-5">
            <label htmlFor="address" className="font-medium text-gray-500">
              Address
            </label>
            <input
              type="text"
              id="address"
              placeholder="Type Here"
              className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-200 font-light"
              required
              value={address}
              onChange={(e)=>setAddress(e.target.value)}
            />
          </div>

          {/* select city dropdown */}
          <div className="w-full mt-4 max-w-60 mr-auto">
            <label htmlFor="city" className="font-medium text-gray-500">
              City
            </label>
            <select
              name="city"
              id="city"
              className=" border border-gray-200 px-3 w-full py-2.5 mt-1 outline-indigo-400 font-light mb-12"
              required
              value={city}
              onChange={(e)=>setCity(e.target.value)}
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <button className="bg-indigo-500 hover:bg-indigo-600 transition-all text-white px-6 py-2 rounded cursor-pointer mt-6 mr-auto">Register</button>
        </div>
      </form>
    </div>
  );
};

export default HotelReg;

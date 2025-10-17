import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURENCEY || "$";
  const navigate = useNavigate();
  const { user } = useUser();
  const { getToken } = useAuth();

  const [isOwner, setIsOwner] = useState(false);
  const [showHotelRegister, setShowHotelRegister] = useState(false);
  const [seerchCites, setSeerchCites] = useState([]);
  const[rooms,setRooms]=useState([])

  const fetchRooms=async()=>{
    try {
      const {data}=await axios.get('/api/rooms')
        if(data.success){
            setRooms(data.rooms)
        }else{
            toast.error(data.message)
        }
    } catch (error) {
        toast.error(error.message)
    }
}

  // const fetchUser = async () => {
  //   try {
  //     const { data } = await axios.get("/api/user", {
  //       headers: {
  //         Authorization: `Bearer ${await getToken()}`,
  //       },
  //     });

  //     if (data.success) {
  //       setIsOwner(data.role === "hotelOwner");
  //       setSeerchCites(data.seerchCites);
  //     } else {
  //       setTimeout(() => {
  //         fetchUser();
  //       }, 3000);
  //     }
  //   } catch (error) {
  //     toast.error(error.message);
  //   }
  // };



  const fetchUser = async () => {
  try {
    const { data } = await axios.get("/api/user", {
      headers: {
        Authorization: `Bearer ${await getToken()}`,
      },
    });

    if (data.success) {
      setIsOwner(data.role === "hotelOwner");
      setSeerchCites(Array.isArray(data.seerchCites) ? data.seerchCites : []); // ✅ هنا التعديل
    } else {
      setTimeout(() => {
        fetchUser();
      }, 3000);
    }
  } catch (error) {
    toast.error(error.message);
  }
};

  useEffect(() => {
    if (user) {
      fetchUser();
    }
    }, [user]);

    useEffect(()=>{
    fetchRooms();
    },[])



  const value = {
    axios,
    navigate,
    user,
    getToken,
    isOwner,
    setIsOwner,
    showHotelRegister,
    setShowHotelRegister,
    currency,
    seerchCites,
    setSeerchCites,
    rooms,
    setRooms,
  };
  return (<ApiContext.Provider value={value}>{children}</ApiContext.Provider>);

};


export const useAppContext = () => useContext(ApiContext);


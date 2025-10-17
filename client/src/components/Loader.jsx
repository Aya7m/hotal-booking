import React, { useEffect } from 'react'
import { useAppContext } from '../context/ApiContext'
import { useParams } from 'react-router-dom';

const Loader = () => {
    const{navigate}=useAppContext();
    const{nextUrl}=useParams();

    useEffect(() => {
        if (nextUrl) {
         setTimeout(() => {
            navigate(`/${nextUrl}`);
         }, 800); // Simulate loading delay
        }
    }, [nextUrl]);
  return (
    <div className='flex justify-center items-center h-screen'>
        <div className='animate-spin rounded-full h-24 w-24 border-4 border-gray-400 border-t-primary'></div>
      
    </div>
  )
}

export default Loader

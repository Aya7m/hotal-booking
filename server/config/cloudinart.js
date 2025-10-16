import{v2 as cloudinary} from 'cloudinary'
import dotenv from 'dotenv'
dotenv.config()

export const cloudinartConfig=async()=>{
  cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET,
   
})
}

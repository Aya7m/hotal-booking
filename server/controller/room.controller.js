import { Hotel } from "../model/hotel.model.js"
import{v2 as cloudinary} from 'cloudinary'
import { Room } from "../model/room.model.js"

// create a new room for a hotel
export const createRoom=async(req,res)=>{
    try {
        
        const{roomType,pricePerNight,amenities}=req.body
        const hotel=await Hotel.findOne({owner:req.auth.userId})
        if(!hotel) return res.status(404).json({success:false,message:"Hotel not found"})

            // upload images to cloudinary
        const uploadImages=req.files.map(async(file)=>{
            const response=await cloudinary.uploader.upload(file.path,{
                folder: "hotel-rooms",
               transformation: [{ quality: "auto:low" }], // ✅ يقلل الحجم تلقائيًا
            });
            return response.secure_url
        })
        // await for upload all images
        const images=await Promise.all(uploadImages)
        await Room.create({hotel:hotel._id,
            roomType,
            pricePerNight:+pricePerNight,
            amenities:JSON.parse(amenities),
            images
        })
        res.status(201).json({success:true,message:"Room created successfully"})
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:error.message})
        
    }
}

// get all rooms of a hotel
export const getHotelRooms=async(req,res)=>{
    try {
        
        const rooms=await Room.find({isAvailable:true}).populate({path:'hotel',populate:{path:'owner',select:'image'}})
        res.status(200).json({success:true,rooms})
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:error.message})
        
    }
}

// get all rooms for specific hotel
export const getRoomsByHotel=async(req,res)=>{

    try {
        
        const hotelData=await Hotel.findOne({owner:req.auth.userId})
        const rooms=await Room.find({hotel:hotelData._id.toString()}).populate('hotel')
        res.status(200).json({success:true,rooms})
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:error.message})
        
    }
}

// toggle room availability
export const toggleRoomAvailability=async(req,res)=>{
    try {
        const{roomId}=req.body
        const roomData=await Room.findById(roomId)
        roomData.isAvailable=!roomData.isAvailable
        await roomData.save()
        res.status(200).json({success:true,message:"Room availability updated"})
        
    } catch (error) {
        
        console.log(error);
        res.status(500).json({success:false,message:error.message})
    }
}
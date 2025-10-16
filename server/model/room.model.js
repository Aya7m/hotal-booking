import mongoose from "mongoose";

const roomSchema= new mongoose.Schema({
    hotel:{type:String ,required:true,ref:'Hotel'},
    roomType:{type:String ,required:true},
    pricePerNight:{type:Number ,required:true},
    amenities: {
    type: [String],
    enum: [
    "Free WiFi", "Free Wifi",  // الحالتين
    "Free Breakfast",
    "Room Service", "Room Services",
    "Mountain View",
    "Pool Access"
    ],
    required: true,
   default: [],
    },

   

    images:[{type:String}],
    isAvailable:{type:Boolean ,default:true}
},{timestamps:true
})


export const Room=mongoose.model('Room',roomSchema)
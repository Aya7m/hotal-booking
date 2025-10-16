import mongoose from "mongoose";

const bookingSchema=new mongoose.Schema({
    user:{type:String ,required:true,ref:'User'},
    hotel:{type:String ,required:true,ref:'Hotel'},
    room:{type:String ,required:true,ref:'Room'},
    checkInDate:{type:Date ,required:true},
    checkOutDate:{type:Date ,required:true},
    totalPrice:{type:Number ,required:true},
    guests:{type:Number ,required:true},
    status:{type:String ,enum:['pending','confirmed','cancelled'],default:'pending'},
    paymentMethod:{type:String ,default:'Pay At Hotel',required:true},
    isPaid:{type:Boolean ,default:false}
},{timestamps:true})

export const Booking=mongoose.model('Booking',bookingSchema)
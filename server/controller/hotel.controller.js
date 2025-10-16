import { Hotel } from "../model/hotel.model.js"
import { User } from "../model/user.model.js"

export const hotelRegister=async(req,res)=>{
    try {
        
        const{ name,address,contact,city}=req.body
        if(!name || !address || !contact  || !city){
            return res.status(400).json({success:false,message:"All fields are required"})
        }

        const owner=req.user._id
        // check if hotel already registered by the owner
        const existingHotel=await Hotel.findOne({owner})
        if(existingHotel){
            return res.status(400).json({success:false,message:"Hotel already registered by you"})
        }
        await Hotel.create({name,address,contact,city,owner })
        await User.findByIdAndUpdate(owner,{role:'hotelOwner'})
        res.status(201).json({success:true,message:"Hotel registered successfully"})

    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:error.message})
        
    }
}
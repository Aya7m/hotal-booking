
import transporter from "../config/nodemuler.js"
import { Booking } from "../model/booking.model.js"
import { Hotel } from "../model/hotel.model.js"
import { Room } from "../model/room.model.js"
import stripe from "stripe"

// check if room is available or not
// const checkRoomAvailability=async({room,checkInDate,checkOutDate})=>{
//     try {
        
//         const bookings=await Booking.find({
//             room,
//             checkOutDate:{$gte:checkInDate},
//             checkInDate:{$lte:checkOutDate},
            
//         })

//         const isAvailable=bookings.length===0
//         return isAvailable
//     } catch (error) {
//         console.log(error);
//         throw new Error('Error checking room availability')
        
//     }

// }

const checkRoomAvailability = async ({ room, checkInDate, checkOutDate }) => {
  try {
    const inDate = new Date(checkInDate);
    const outDate = new Date(checkOutDate);

    const bookings = await Booking.find({
      room,
      checkOutDate: { $gt: inDate }, // checkOutDate أكبر من inDate
      checkInDate: { $lt: outDate }, // checkInDate أقل من outDate
    });

    console.log("Overlapping bookings:", bookings); // <-- اختبري هنا

    return bookings.length === 0;
  } catch (error) {
    console.log(error);
    throw new Error("Error checking room availability");
  }
};


// check availability function api

export const checkAvailability=async(req,res)=>{
    try {
        
        const{room,checkInDate,checkOutDate}=req.body
        const isAvailable=await checkRoomAvailability({room,checkInDate,checkOutDate})
        res.status(200).json({success:true,isAvailable})
    } catch (error) {
        res.status(500).json({success:false,message:error.message})
         console.log(error);
    }
}


// create a new booking
export const createBooking=async(req,res)=>{
    try {
        
        const{room,checkInDate,checkOutDate,guests}=req.body
        const user=req.user._id
        // check if room is available
        const isAvailable=await checkRoomAvailability({room,checkInDate,checkOutDate})
        if(!isAvailable) return res.status(400).json({success:false,message:"Room is not available for the selected dates"})
            // get totalPrice from room
        const roomData=await Room.findById(room).populate('hotel')
        let totalPrice=roomData.pricePerNight
        // calculite total price based on nights
        const checkIn=new Date(checkInDate)
        const checkOut=new Date(checkOutDate)
        const timeDiff=checkOut.getTime()-checkIn.getTime()
        const numberOfNights=Math.ceil(timeDiff/(1000*3600*24))
        totalPrice=totalPrice*numberOfNights

        const booking=await Booking.create({
            room,
            user,
            checkInDate,
            checkOutDate,
            guests:+guests,
            totalPrice,
            hotel:roomData.hotel._id
        })

        const mailOptions={

            from:process.env.SENDER_EMAIL,
            to:req.user.email,
            subject:'Hotel Booking Details',
            html:`
            <h2>Hotel Booking</h2>
            <p>Dear ${req.user.username}</p>
            <p>thank you for your booking</p>
            <ul>
              <li><strong>Booking Id :</strong> ${booking._id}</li>
              <li><strong>Hotel Name :</strong> ${roomData.hotel.name}</li>
              <li><strong>Location :</strong> ${roomData.hotel.address}</li>
              <li><strong>Date :</strong> ${booking.checkInDate.toDateString()}</li>
              <li><strong>Booking Amount :</strong> ${process.env.CURENCEY || '$'} ${booking.totalPrice}/night</li>
            </ul>
            <p>we look forward to welcoming You</p>
            `
        }

        await transporter.sendMail(mailOptions)

        res.status(201).json({success:true,message:"Booking created successfully"})
            
       
    } catch (error) {
        res.status(500).json({success:false,message:error.message})
         console.log(error);
        
    }
}

// get all bookings for a user
export const getUserBookings=async(req,res)=>{
    try {
        
        const user=req.user._id
        const bookings=await Booking.find({user}).populate('room').populate('hotel').sort({createdAt:-1})
        res.status(200).json({success:true,bookings})
    } catch (error) {
        res.status(500).json({success:false,message:error.message})
         console.log(error);
    }
}
    
    
// get all bookings for a hotel owner
export const getHotelBookings=async(req,res)=>{
    try {
        const hotel=await Hotel.findOne({owner:req.auth.userId})
        if(!hotel) return res.status(404).json({success:false,message:"Hotel not found"})
        const bookings=await Booking.find({hotel:hotel._id}).populate('room hotel').sort({createdAt:-1})
    // total bookings
    const totalBookings=bookings.length
    // total revenue
    const totalRevenue=bookings.reduce((total,booking)=>total+booking.totalPrice,0)
        res.status(200).json({success:true,dashboardData:{totalBookings,totalRevenue,bookings}})
        
    } catch (error) {
        res.status(500).json({success:false,message:error.message})
         console.log(error);
        
    }
}
    

export const stripePayment=async(req,res)=>{
    try {
        
        const{bookingId}=req.body
        const booking=await Booking.findById(bookingId)
        const roomData=await Room.findById(booking.room).populate('hotel')
        const totalPrice=booking.totalPrice
        const {origin}=req.headers

        const stripeInstance=new stripe(process.env.STRIPE_SECRET_KEY)

        const line_items=[
            {
                price_data:{
                    currency:'usd',
                    product_data:{
                        name:roomData.hotel.name,
                        images:[roomData.images[0]],
                    },
                    unit_amount:totalPrice*100,
                },
                
                quantity:1,
            }
        ]
        // create checkout session
        const session=await stripeInstance.checkout.sessions.create({
            payment_method_types:['card'],
            mode:'payment',
            line_items,
            customer_email:req.user.email,
            metadata:{
                bookingId
            },
            success_url:`${origin}/loader/my-booking`,
            cancel_url:`${origin}/my-booking`,
        })
        res.status(200).json({success:true,url:session.url})



    } catch (error) {
        res.status(500).json({success:false,message:error.message})
         console.log('payment failed',error);
        
    }
}
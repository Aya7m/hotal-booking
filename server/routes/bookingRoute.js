import { Router } from "express";
import { checkAvailability, createBooking, getHotelBookings, getUserBookings } from "../controller/booking.controller.js";
import { protect } from "../middleware/authMeddleware.js";

const bookingRoute=Router()

bookingRoute.post('/check-availability',checkAvailability)
bookingRoute.post('/book',protect,createBooking)
bookingRoute.get('/user',protect,getUserBookings)
bookingRoute.get('/hotel',protect,getHotelBookings)
export default bookingRoute
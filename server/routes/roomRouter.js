import { Router } from "express";
import upload from "../middleware/uploadMiddleware.js";
import { protect } from "../middleware/authMeddleware.js";
import { createRoom, getHotelRooms, getRoomsByHotel, toggleRoomAvailability } from "../controller/room.controller.js";

const roomRouter=Router();

roomRouter.post('/',upload.array('images',5),protect,createRoom)
roomRouter.get('/',getHotelRooms)
roomRouter.get('/owner',protect,getRoomsByHotel)
roomRouter.post('/toggle-availability',protect,toggleRoomAvailability)

export default roomRouter;
import { Router } from "express";
import { protect } from "../middleware/authMeddleware.js";
import { hotelRegister } from "../controller/hotel.controller.js";

const hotelRoute=Router();

hotelRoute.post('/',protect,hotelRegister)

export default hotelRoute
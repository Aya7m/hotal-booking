import { Router } from "express";
import { getUserData, storeRecentSearchCities } from "../controller/user.controller.js";
import { protect } from "../middleware/authMeddleware.js";

const userRoute=Router();

userRoute.get('/',protect,getUserData)
userRoute.post('/setSearchCites',protect,storeRecentSearchCities)
export default userRoute;
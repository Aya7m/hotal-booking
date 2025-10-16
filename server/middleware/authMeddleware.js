import { User } from "../model/user.model.js"

export const protect=async(req, res, next) => {
    try {

        const{userId} = req.auth
        if(!userId) return res.status(401).json({success:false,message:"Unauthorized"})
        else{

            const user=await User.findById(userId)
            if(!user) return res.status(404).json({success:false,message:"User not found"})
            req.user=user
            next()
        }
        
    } catch (error) {
        console.log(error);
        
        
    }
}
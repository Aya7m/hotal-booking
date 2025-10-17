// import { User } from "../model/user.model.js"

// export const protect=async(req, res, next) => {
//     try {

//         const{userId} = req.auth
//         if(!userId) return res.status(401).json({success:false,message:"Unauthorized"})
//         else{

//             const user=await User.findById(userId)
//             if(!user) return res.status(404).json({success:false,message:"User not found"})
//             req.user=user
//             next()
//         }
        
//     } catch (error) {
//         console.log(error);
        
        
//     }
// }



import { User } from "../model/user.model.js";

export const protect = async (req, res, next) => {
  try {
    // ✅ هنا بنستخدم req.auth() بدل req.auth
    const authData = await req.auth?.();

    const userId = authData?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(500).json({ success: false, message: "Server error in auth middleware" });
  }
};

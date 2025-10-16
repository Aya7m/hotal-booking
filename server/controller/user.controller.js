// get user from clerk 

export const getUserData = async (req,res) => {
    try {
         const role= req.user.role;
         const recentSearchedCities= req.user.recentSearchedCities;
         res.status(200).json({success:true,role,recentSearchedCities})
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:"Server Error"})
        
    }
}

// store recent cites search 
export const storeRecentSearchCities=async(req,res)=>{
    try {
        const{recentSearchedCities}=req.body
        const user=await req.user
        if(user.recentSearchedCities.length <3){
            user.recentSearchedCities.push(recentSearchedCities)
        }
        else{
            user.recentSearchedCities.shift()
            user.recentSearchedCities.push(recentSearchedCities)
        }

        await user.save()
        res.status(200).json({success:true,message:'city added successfully'})
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:"Server Error"})
        
    }
}
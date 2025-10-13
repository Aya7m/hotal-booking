import { Webhook } from "svix"
import { User } from "../model/user.model.js"

export const clerkWebHook=async(req,res)=>{
    try {
        
        // create svex instance with clerk web secrit
        const whook=new Webhook(process.env.CLERK_WEBHOOK_SECRITE)

        // getting header
        const headers={
            "svix-id":req.headers['svix-id'],
            "svix-timestamp":req.headers['svix-timestamp'],
            'svix-signature':req.headers['svix-signature']
        }

        // verify headers
        await whook.verify(JSON.stringify(req.body,headers))
        // getting data from request body
        const{data,type}=req.body
        const userData={
            _id:data.id,
            email:data.email_address[0].email_address,
            username:data.first_name + " " + data.last_name,
            image:data.image_url
        }

        // switch for diverent events
        switch(type){
            case 'user.created':{
                await User.create(userData)
                break;
            }

            case 'user.updated':{
                await User.findByIdAndUpdate(data.id,userData)
                break;
            }
             case 'user.deleted':{
                await User.findByIdAndDelete(data.id)
                break;
            }
            default:
                break;
        }

        res.json({success:true,message:'webhook recieved'})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
        
        
    }
}
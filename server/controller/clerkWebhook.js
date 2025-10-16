import { Webhook } from "svix";
import { User } from "../model/user.model.js";

export const clerkWebHook = async (req, res) => {
  try {
    console.log("📩 Webhook received from Clerk!");

    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);


    
    // 🔒 تحقّق من التوقيع باستخدام المفاتيح الخاصة بالـ headers
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

   await whook.verify(JSON.stringify(req.body), headers);
    const { data, type } = req.body;

    

    switch (type) {
      case "user.created":{

        const userData = {
      _id: data.id,
      email : data.email_addresses?.[0]?.email_address || "no-email",
      username: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
      image: data.image_url,
    };
        await User.create(userData);
        console.log("✅ User created:", userData);
        break;
      }
        

      case "user.updated":{

        const userData = {
      _id: data.id,
      email : data.email_addresses?.[0]?.email_address || "no-email",
      username: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
      image: data.image_url,
    };
    await User.findByIdAndUpdate(data.id, userData);
        console.log("📝 User updated:", data.id);
        break;
      }
        

      case "user.deleted":{
         await User.findByIdAndDelete(data.id);
        console.log("🗑️ User deleted:", data.id);
        break;
      }
       

      default:
        console.log("ℹ️ Unhandled event type:", type);
    }

    res.status(200).json({ success: true, message: "Webhook processed successfully" });
  } catch (error) {
    console.error("❌ Webhook Error:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

import mongoose from "mongoose";

export const connection_db = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ DB connection successful");
  } catch (error) {
    console.log("❌ Error in DB connection:", error);
  }
};

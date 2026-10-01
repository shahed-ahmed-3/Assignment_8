import mongoose from "mongoose";
import { DB_URI } from "../config.js";
import { UserModel } from "./Model/index.js";
import { connectRedis } from "./redis.connection.js";

export const bootstrapDB = async (app, port) => {
  try {
    await mongoose.connect(DB_URI,{serverSelectionTimeoutMS:30000})
    console.log("DB connected");
    await connectRedis()
    await UserModel.syncIndexes()
    app.listen(port, () =>
    console.log(`Server is running in port ${port} 🌸`)
    );
  } catch (error) {
    console.log(error);
    
    console.log("Fail to connect on DB");
  }
}

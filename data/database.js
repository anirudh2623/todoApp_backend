import mongoose from "mongoose";

export const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "backendapi",
    })
    .then((c) => {
      console.log(`Database Connected with ${c.connection.host}`);
    })
    .catch((err) => {
      console.log("MongoDB connection error:", err);
    });
};

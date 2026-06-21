import mongoose from "mongoose";

const myDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.log(
        "MONGO_URI not set in environment (.env file missing or variable empty)"
      );
      process.exit(1);
    }

    const connInstance = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      "MongoDB connected successfully! DB host: ",
      connInstance.connection.host
    );
  } catch (error) {
    console.log("MongoDB connection error", error);
    process.exit(1);
  }
};

export default myDB;
import mongoose from "mongoose";

const connectDB = async (url) => {
  try {
    // Use the provided URL directly for MongoDB connection
    console.log(url);
    const connectionInstance = await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    // Log connection success
    console.log(`Database is connected to ${connectionInstance.connection.host}`);
  } catch (error) {
    // Log any connection errors
    console.error("Database connection is not established", error);
    process.exit(1); // Exit process if the connection fails
  }
};

export  {connectDB};
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://johnnyle1812:Johnle1786@cluster0.bomqvb3.mongodb.net/"
    );
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = connectDB;

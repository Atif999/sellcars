require("dotenv").config();
const mongoose = require("mongoose");

let mongoServer = null;

const isTest = process.env.NODE_ENV === "test";

const connectDatabase = async () => {
  if (isTest) {
    console.log("check");
  } else if (process.env.NODE_ENV === "prod") {
    const url = process.env.DB_URL || "";
    await mongoose.connect(url);
  }
};

const disconnectDatabase = async () => {
  await mongoose.disconnect();

  if (isTest && mongoServer) {
    await mongoServer.stop();
    mongoServer = null;
  }
};

module.exports = { connectDatabase, disconnectDatabase };

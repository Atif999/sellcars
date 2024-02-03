const express = require("express");
const bodyParser = require("body-parser");
const { connectDatabase } = require("./utils/connectDB");
const userRoutes = require("./routes/userRoutes");
const customerRoutes = require("./routes/customerRoutes");
const cors = require("cors");
require("dotenv").config();
const User = require("./models/user");
const crypto = require("crypto");

const app = express();

if (process.env.NODE_ENV === "prod") {
  connectDatabase();
  createInitialUsers();
}

app.use(cors());
app.use(bodyParser.json());

app.use("/user", userRoutes);
app.use("/customer", customerRoutes);

async function createInitialUsers() {
  try {
    // Check if any users exist
    const usersCount = await User.countDocuments();
    if (usersCount === 0) {
      // No users exist, create initial users
      const initialUsers = [
        {
          first_name: "Atif",
          last_name: "Uddin",
          email: "atif@gmail.com",
          password: hashPassword("pass123"),
        },
        {
          first_name: "James",
          last_name: "Blake",
          email: "james@gmail.com",
          password: hashPassword("pass123"),
        },
        {
          first_name: "John",
          last_name: "Chang",
          email: "john@gmail.com",
          password: hashPassword("pass123"),
        },
        // Add more initial users as needed
      ];

      // Create users in the database
      await User.insertMany(initialUsers);
      console.log("Initial users created successfully");
    } else {
      console.log("Users already exist. Skipping creation.");
    }
  } catch (error) {
    console.error("Error creating initial users:", error);
  }
}

function hashPassword(password) {
  const hash = crypto.createHash("md5");
  hash.update(password);
  return hash.digest("hex");
}
module.exports = app;

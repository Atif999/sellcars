const User = require("../models/user");

const crypto = require("crypto");

async function loginUser(email, password) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid email or password");
  }
  const hash = crypto.createHash("md5");
  hash.update(password);
  inputPassword = hash.digest("hex");

  if (user.password !== inputPassword) {
    throw new Error("Invalid email or password");
  }

  user.updated_at = Date.now();
  await user.save();

  return user;
}

async function getUserInfo(email) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const response = {
    name: user.first_name + " " + user.last_name,
    lastLogin: user.updated_at,
  };

  return response;
}

module.exports = { loginUser, getUserInfo };

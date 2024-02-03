const userService = require("../services/userService");

async function login(req, res, next) {
  const { email, password } = req.body;
  try {
    const user = await userService.loginUser(email, password);
    if (user) {
      res.status(200).json({ message: "Login successful" });
    }
  } catch (error) {
    next(error);
  }
}

async function getUser(req, res, next) {
  const email = req.query.email;
  try {
    const resp = await userService.getUserInfo(email);
    if (resp) {
      res.status(200).json(resp);
    }
  } catch (error) {
    next(error);
  }
}

module.exports = { login, getUser };

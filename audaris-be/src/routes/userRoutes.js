const express = require("express");
const userController = require("../controllers/userController");
const userMiddleware = require("../middleware/userValidation");

const router = express.Router();

router.put("/login", userMiddleware.validateLoginInput, userController.login);

router.get("/getUser", userController.getUser);

module.exports = router;

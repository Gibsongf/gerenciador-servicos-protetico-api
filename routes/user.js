const express = require("express");
const router = express.Router();
const user_controllers = require("../controllers/user_controllers");

router.post("/register", user_controllers.register);
module.exports = router;

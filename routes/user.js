const express = require("express");
const router = express.Router();
const user_controllers = require("../controllers/user_controllers");
const passport = require("passport");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function saltPassword(req, res, next) {
  bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
    if (err) {
      next();
    }
    req.body.password = hashedPassword;
    next();
  });
}

router.post("/register", saltPassword, user_controllers.register);
router.post("/login", user_controllers.login);
router.post("/edit", user_controllers.edit);
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  user_controllers.get,
);
router.get(
  "/validate",
  passport.authenticate("jwt", { session: false }),
  user_controllers.validate,
);
module.exports = router;

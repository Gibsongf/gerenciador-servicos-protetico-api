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
router.post("/login", function (req, res, next) {
    passport.authenticate("local", (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({
                message: "Something is not right",
                user: user,
            });
        }
        req.login(user, (err) => {
            if (err) {
                res.send(err);
            }
            const token = jwt.sign(
                { id: user._id, user_name: user.user_name },
                process.env.JwtKey
            );
            return res.json({ token: token });
        });
    })(req, res);
});
module.exports = router;

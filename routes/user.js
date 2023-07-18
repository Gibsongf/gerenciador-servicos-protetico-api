const express = require("express");
const router = express.Router();
const user_controllers = require("../controllers/user_controllers");
const passport = require("passport");
const bcrypt = require("bcrypt");

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
    passport.authenticate("local", { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({
                message: "Something is not right",
                user: user,
            });
        }
        req.login(user, { session: false }, (err) => {
            if (err) {
                res.send(err);
            }
            // generate a signed son web token with the contents of user object and return it in the response
            // const token = jwt.sign(
            //     { id: user._id, user_name: user.user_name },
            //     process.env.JwtKey
            // );
            return res.json({ user });
        });
    })(req, res);
});
module.exports = router;

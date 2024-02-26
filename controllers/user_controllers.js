const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const User = require("../models/user");
const passport = require("passport");

exports.register = [
    body("username")
        .notEmpty()
        .withMessage("Usuário deve ser especificado")
        .isLength({ min: 3 })
        .withMessage("Usuário muito curto")
        .isLength({ max: 15 })
        .withMessage("Usuário muito grande"),
    body("password")
        .notEmpty()
        .withMessage("Senha deve ser especificado")
        .isLength({ min: 3 })
        .withMessage("Senha muito curta"),
    asyncHandler(async (req, res) => {
        const err = validationResult(req);

        const user = new User({
            username: req.body.username,
            password: req.body.password,
        });

        if (!err.isEmpty()) {
            console.log(err.errors);
            res.json({ errors: err.errors });
        } else {
            await user.save();
            res.json({ message: "User register completed", user });
        }
    }),
];

exports.login = function (req, res) {
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
};

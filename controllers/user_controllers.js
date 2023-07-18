const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const User = require("../models/user");

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

exports.login = asyncHandler(async (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password,
    });
    console.log("asda");
    res.json({ msg: "successfully login" });
});

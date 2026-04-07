const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const User = require("../models/user");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const Utility = require("../utils/utility");

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
      res.status(400).json({ message: Utility.errorMsg(err) });
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
        message: info.message,
        user: user,
      });
    }
    req.login(user, (err) => {
      if (err) {
        res.send(err);
      }
      const token = jwt.sign(
        { id: user._id, user_name: user.user_name },
        process.env.JwtKey,
      );
      return res.json({ token: token, user: true });
    });
  })(req, res);
};
exports.get = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    const user = await User.findById(userId);

    if (user.length === 0) {
      return res.status(404).json({
        message: "Nenhum Usuario encontrado",
      });
    }
    res.status(200).json(user);
  } catch (err) {
    res.sendStatus(400);
  }
});
exports.validate = function (req, res) {
  res.status(200).json({
    valid: true,
    user: req.user,
  });
};
exports.edit = [
  body("username")
    .notEmpty()
    .withMessage("Usuário deve ser especificado")
    .isLength({ min: 3 })
    .withMessage("Usuário muito curto")
    .isLength({ max: 15 })
    .withMessage("Usuário muito grande"),
  body("telefone")
    .optional({ checkFalsy: true })
    .trim()
    .escape()
    .isLength({ max: 14 })
    .withMessage("Número inválido ")
    .isLength({ min: 9 })
    .withMessage("Número incompleto"),
  asyncHandler(async (req, res) => {
    const err = validationResult(req);
    const update = Utility.emptyFields(req.body);
    if (!err.isEmpty()) {
      res.status(400).json({ message: Utility.errorMsg(err) });
    } else {
      const user = await User.findByIdAndUpdate(req.params.id, update, {
        new: true,
      }).exec();
      res.status(200).json({ message: "User atualizado", user });
    }
  }),
];

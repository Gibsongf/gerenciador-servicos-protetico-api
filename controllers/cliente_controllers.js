const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Cliente = require("../models/cliente");
const Local = require("../models/local");
const Serviço = require("../models/serviço");
const Utility = require("../utils/utility");
// Route Test
exports.test = asyncHandler(async (req, res) => {
  res.json({ message: "Test Cliente" });
});

exports.todos = asyncHandler(async (req, res) => {
  const all = await Cliente.find({ user: req.user.id })
    .sort({ nome: 1 })
    .populate("local")
    .populate("serviços")
    .exec();
  console.log(all);
  if (all.length === 0) {
    res.status(404).json({ message: "Nenhum Cliente encontrado" });
  } else {
    res.status(200).json({
      all,
    });
  }
});

exports.detalhes = asyncHandler(async (req, res) => {
  const cliente = await Cliente.findById(req.params.id)
    .populate("local")
    .exec();
  const serviços = await Serviço.find({ cliente: cliente._id })
    .populate("cliente")
    .populate("produto")
    .exec();
  if (cliente.length === 0) {
    res.sendStatus(404).json({ message: "Cliente não encontrado" });
  }
  res.status(200).json({ cliente, serviços });
});
// isPostalCode(locale: 'BR'): ValidationChain CEP ?
exports.novo = [
  body("nome").trim().notEmpty().withMessage("O Nome não especificado"),
  // body("sobrenome").trim(),
  body("local") //isMongoId()
    .trim()
    .notEmpty()
    .withMessage("O Local não especificado"),
  body("telefone")
    .optional({ checkFalsy: true })
    .trim()
    .escape()
    .isLength({ max: 14 })
    .withMessage("Número inválido ")
    .isLength({ min: 9 })
    .withMessage("Número incompleto"),
  body("cpf")
    .optional({ checkFalsy: true })
    .trim()
    .escape()
    .isNumeric()
    .isLength({ max: 11, min: 11 })
    .withMessage("O CPF deve ter 11 dígitos."),
  asyncHandler(async (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      res.status(400).json({ message: Utility.errorMsg(err) });
    } else {
      const local = await Local.findById(req.body.local).exec();
      const model = Utility.emptyFields(req.body);
      model.local = local._id;
      model.user = req.user.id;
      const cliente = new Cliente(model);
      await cliente.save();
      res.status(200).json({ message: "Cliente salvo", cliente });
    }
  }),
];

exports.editar = [
  body("nome")
    .trim()
    .isLength({ min: 3 })
    .withMessage("O Nome não especificado"),
  // body("sobrenome").trim(),
  body("local").trim().notEmpty().withMessage("O Local não especificado"),
  body("telefone")
    .optional({ checkFalsy: true })
    .trim()
    .escape()
    .isLength({ max: 14 })
    .withMessage("Número inválido ")
    .isLength({ min: 9 })
    .withMessage("Número incompleto"),
  body("cpf")
    .optional({ checkFalsy: true })
    .trim()
    .escape()
    .isNumeric()
    .isLength({ max: 11, min: 11 })
    .withMessage("O CPF deve ter 11 dígitos."),
  asyncHandler(async (req, res) => {
    // when local changes, must change all services that are vinculated to this cliente
    // to the new local
    let cliente = await Cliente.findById(req.params.id).exec();
    const err = validationResult(req);
    const update = Utility.emptyFields(req.body);
    if (!err.isEmpty()) {
      res.status(400).json({ message: Utility.errorMsg(err) });
    } else {
      if (String(cliente.local) !== update.local) {
        const serviço = await Serviço.find({ cliente: cliente._id })
          .updateMany({ local: update.local })
          .exec();
      }
      cliente = await Cliente.findByIdAndUpdate(req.params.id, update, {
        new: true,
      }).exec();
      res.status(200).json({ message: "Cliente modificado", cliente });
    }
  }),
];

exports.deletar = asyncHandler(async (req, res) => {
  const [cliente, clienteServices] = await Promise.all([
    Cliente.findById(req.params.id).exec(),
    Serviço.find({ cliente: req.params.id }),
  ]);
  if (clienteServices.length > 0) {
    // If there are associated "Serviço", handle the response accordingly
    return res.status(409).json({
      status: "error",
      message:
        "Cliente não pode ser deletado pois possui Serviço relacionados a ele",
    });
  } else {
    await Cliente.findByIdAndRemove(req.params.id).exec();
    res.status(200).json({
      status: "success",
      message: "Cliente deletado.",
    });
  }
});

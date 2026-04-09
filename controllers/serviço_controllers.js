const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Serviço = require("../models/serviço");
const Utility = require("../utils/utility");
const { format } = require("date-fns");
// TODO change produto to produtos
// Route Test
exports.test = asyncHandler(async (req, res) => {
  res.json({ message: "Test Serviço" });
});
// Read
// Todos os serviços
exports.todos = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const all = await Serviço.find({ user: req.user.id })
    .populate("cliente")
    .populate("produtos.produto")
    .populate("local")
    .exec();
  if (!all) {
    res.status(404).json({
      message: "Nenhum Serviço foi encontrado",
    });
  } else {
    res.status(200).json({
      all,
    });
  }
});
// Detalhes de um serviço
exports.detalhes = asyncHandler(async (req, res) => {
  const serviço = await Serviço.findById(req.params.id)
    .populate("cliente")
    .populate("produtos.produto")
    .populate("local")
    .exec();
  if (!serviço) {
    res.status(404).json({
      message: "Serviço não foi encontrado",
    });
  }
  res.status(200).json({
    serviço,
  });
});
// Create
// Adicionar um novo serviço
exports.novo = [
  body("cliente")
    .notEmpty()
    .withMessage("Cliente não especificado")
    .isMongoId()
    .withMessage("Cliente não encontrado"),
  body("paciente").notEmpty().withMessage("Paciente não especificado"),
  body("local").notEmpty().withMessage("Local não especificado"),
  body("produtos").exists().withMessage("Produtos não especificado"),
  asyncHandler(async (req, res) => {
    const err = validationResult(req);
    const serviçoModel = {
      cliente: req.body.cliente,
      produtos: req.body.produtos,
      paciente: req.body.paciente,
      local: req.body.local,
      statusEntrega: req.body.statusEntrega,
      user: req.user.id,
    };

    const serviço = new Serviço(serviçoModel);
    if (!err.isEmpty()) {
      res.status(400).json({ message: Utility.errorMsg(err) });
    } else {
      await serviço.save();
      res.status(200).json({ message: "Serviço Salvo", serviço });
    }
  }),
];
exports.detailsByLocal = asyncHandler(async (req, res) => {
  const serviço = await Serviço.find({ local: req.params.id })
    .populate("cliente")
    .populate("produtos")
    .exec();
  if (!serviço) {
    res.status(404).json({
      message: "Serviço não foi encontrado",
    });
  }
  res.status(200).json({
    serviço,
  });
});
exports.detailsByClient = asyncHandler(async (req, res) => {
  const serviço = await Serviço.find({ cliente: req.params.id }).exec();
  if (!serviço) {
    res.status(404).json({
      message: "Serviço não foi encontrado",
    });
  }
  res.status(200).json({
    serviço,
  });
});
// Update
// Modificar um serviço
exports.editar = [
  body("local").isMongoId().withMessage("Local não encontrado"),
  body("cliente").isMongoId().withMessage("Cliente não encontrado"),
  body("paciente")
    .isLength({ min: 3 })
    .withMessage("Paciente não especificado"),

  asyncHandler(async (req, res) => {
    const err = validationResult(req);
    if (!req.body.produtos.length) {
      err.errors.push({
        msg: "Nenhum produto selecionado",
        path: "produto",
      });
    }

    const update = Utility.emptyFields(req.body, true);

    if (!err.isEmpty()) {
      res.status(400).json({ message: Utility.errorMsg(err) });
    } else {
      const serviço = await Serviço.findByIdAndUpdate(req.params.id, update, {
        new: true,
      }).exec();
      res.status(200).json({ message: "Serviço Atualizado", serviço });
    }
  }),
];
// Delete
// Deletar um serviço
exports.deletar = asyncHandler(async (req, res) => {
  const serviço = await Serviço.findByIdAndRemove(req.params.id).exec();
  res.status(200).json({
    status: "success",
    message: "Serviço deletado",
  });
});

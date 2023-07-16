const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
// const Dentista = require("../models/dentista");
// const Local = require("../models/local");
const Serviço = require("../models/serviço");
const Utility = require("../utility");
// const Paciente = require("../models/paciente");
const Produto = require("../models/produto");

// Route Test
exports.test = asyncHandler(async (req, res) => {
    res.json({ message: "Test Produto" });
});

// Read
// Todos os produtos
exports.todos = asyncHandler(async (req, res) => {
    const all = await Produto.find().sort({ nome: 1 }).exec();
    if (!all) {
        res.sendStatus(404);
    }
    res.status(200).json({
        todos_produtos: all,
    });
    // res.json({ message: "Not implemented 'todos locais'" });
});
// Detalhes de um produto
exports.detalhes = asyncHandler(async (req, res) => {
    const produto = await Produto.findById(req.params.id).exec();
    if (!produto) {
        res.status(404).json({ message: "Produto não foi encontrado pela ID" });
    }

    const serviço = await Serviço.find({ produto: produto._id }).exec();
    res.status(200).json({ produto, serviço });
});
// Create
// Adicionar um novo produto
exports.novo = [
    body("nome")
        .trim()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("O Nome tem que ser especificado"),
    body("valor normal")
        .notEmpty()
        .withMessage("Valor normal nao especificado")
        .isNumeric()
        .withMessage("São aceitos apenas números"),
    body("valor reduzido")
        .isNumeric()
        .withMessage("São aceitos apenas números"),
    asyncHandler(async (req, res) => {
        const err = validationResult(req);
        const produto = new Produto({
            nome: req.body.nome, //require true
            valor_normal: req.body["valor normal"],
            valor_reduzido: req.body["valor reduzido"],
        });

        if (!err.isEmpty()) {
            console.log(err.errors);
            res.json({ errors: err.errors });
        } else {
            // console.log("saved");
            await produto.save();
            res.status(200).json({ message: "Produto saved", produto });
        }
    }),
];
// Update
// Modificar um produto existente
exports.editar = [
    body("nome")
        .trim()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("O Nome tem que ser especificado"),
    body("valor normal")
        .notEmpty()
        .withMessage("Valor normal nao especificado")
        .isNumeric()
        .withMessage("São aceitos apenas números"),
    asyncHandler(async (req, res) => {
        const err = validationResult(req);
        const update = Utility.emptyFields(req.body, true);
        //'local' to be able to update need to return a id value at forms
        const produto = await Produto.findByIdAndUpdate(req.params.id, update, {
            new: true,
        }).exec();
        if (!err.isEmpty()) {
            res.json({ errors: err.errors });
        } else {
            await produto.save();
            res.status(200).json({ message: "Local updated", produto });
        }
    }),
];
// Delete
// Deletar um produto
exports.deletar = asyncHandler(async (req, res) => {
    res.send("Not implemented 'deletar produto'");
});

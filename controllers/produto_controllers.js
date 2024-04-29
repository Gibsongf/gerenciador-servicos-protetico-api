const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Serviço = require("../models/serviço");
const Utility = require("../utils/utility");
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
        all,
    });
});
// Detalhes de um produto
exports.detalhes = asyncHandler(async (req, res) => {
    const produto = await Produto.findById(req.params.id).exec();
    if (!produto) {
        res.status(404).json({ message: "Produto não foi encontrado" });
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
        .withMessage("O Nome tem que ser especificado"),
    body("valor_normal")
        .notEmpty()
        .withMessage("Valor normal nao especificado")
        .isNumeric()
        .withMessage("São aceitos apenas números"),
    body("valor_reduzido")
        .isNumeric()
        .withMessage("São aceitos apenas números"),
    asyncHandler(async (req, res) => {
        const err = validationResult(req);
        let errors = {};
        const hasIt = await Produto.findOne({
            nome: req.body.nome,
        });

        const produto = new Produto({
            nome: req.body.nome, //require true
            valor_normal: req.body.valor_normal,
            valor_reduzido: req.body.valor_reduzido,
        });

        if (hasIt) {
            errors = { nome: "Produto já registrado" };
            res.status(400).json({ errors });
        } else if (!err.isEmpty()) {
            err.errors.forEach((e) => {
                errors[e.path] = e.msg;
            });
            res.status(400).json({ errors });
        } else {
            await produto.save();
            res.status(200).json({ message: "Produto salvo", produto });
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
    body("valor_normal")
        .notEmpty()
        .withMessage("Valor normal nao especificado")
        .isNumeric()
        .withMessage("São aceitos apenas números"),

    asyncHandler(async (req, res) => {
        const err = validationResult(req);
        const update = Utility.emptyFields(req.body, true);
        //'local' need a id to be able to update, need to return id
        // console.log(req.body, "body");
        if (!err.isEmpty()) {
            const errors = {};
            err.errors.forEach((e) => {
                errors[e.path] = e.msg;
            });
            res.status(400).json({ errors });
        } else {
            const produto = await Produto.findByIdAndUpdate(
                req.params.id,
                update,
                {
                    new: true,
                }
            ).exec();
            await produto.save();
            res.status(200).json({ message: "Produto atualizado", produto });
        }
    }),
];
// Delete
// Deletar um produto
exports.deletar = asyncHandler(async (req, res) => {
    const [produto, produtoInServices] = await Promise.all([
        Produto.findById(req.params.id).exec(),
        Serviço.find({ produto: req.params.id }).exec(),
    ]);

    if (produtoInServices.length) {
        return res.status(409).json({
            status: "error",
            message:
                "Produto não pode ser deletado pois possui Serviços relacionados a ele",
        });
    } else {
        await Produto.findByIdAndRemove(req.params.id).exec();
        res.status(200).json({
            status: "success",
            message: "Produto deletado.",
        });
    }
});

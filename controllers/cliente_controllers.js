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
    const all = await Cliente.find().sort({ nome: 1 }).populate("local").exec(); //.sort({ nome: 1 })
    if (!all) {
        res.sendStatus(404);
    }
    res.status(200).json({
        all,
    });
});

exports.detalhes = asyncHandler(async (req, res) => {
    const cliente = await Cliente.findById(req.params.id)
        .populate("local")
        .exec();
    const serviços = await Serviço.find({ cliente: cliente._id })
        .populate("cliente")
        .populate("produto")
        .exec();
    if (!cliente) {
        res.sendStatus(404);
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
        .isLength({ min: 13 })
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
            const errors = {};
            err.errors.forEach((e) => {
                errors[e.path] = e.msg;
            });
            res.status(400).json({ errors });
        } else {
            const local = await Local.findById(req.body.local).exec();
            const model = Utility.emptyFields(req.body);
            model.local = local._id;
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
        .isLength({ min: 13 })
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
        const update = Utility.emptyFields(req.body);
        if (!err.isEmpty()) {
            const errors = {};
            err.errors.forEach((e) => {
                errors[e.path] = e.msg;
            });
            res.status(400).json({ errors });
        } else {
            const cliente = await Cliente.findByIdAndUpdate(
                req.params.id,
                update,
                {
                    new: true,
                }
            ).exec();
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

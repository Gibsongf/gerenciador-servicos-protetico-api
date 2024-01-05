const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Serviço = require("../models/serviço");
const Utility = require("../utils/utility");
const Local = require("../models/local");

// Route Test
exports.test = asyncHandler(async (req, res) => {
    res.json({ message: "Test Serviço" });
});
// Read
// Todos os serviços
exports.todos = asyncHandler(async (req, res) => {
    const all = await Serviço.find()
        .populate("dentista")
        .populate("produto")
        .exec();

    if (!all) {
        res.sendStatus(404);
    }
    res.status(200).json({
        all,
    });
});
// Detalhes de um serviço
exports.detalhes = asyncHandler(async (req, res) => {
    const serviço = await Serviço.findById(req.params.id)
        .populate("dentista")
        .populate("produto")
        .populate("local")
        .exec();
    if (!serviço) {
        res.status(404).json({
            message: "Serviço não foi encontrado",
        });
    }
    // console.log(serviço);
    res.status(200).json({
        serviço,
    });
});
// Create
// Adicionar um novo serviço
exports.novo = [
    body("dentista")
        .notEmpty()
        .withMessage("Dentista não especificado")
        .isMongoId()
        .withMessage("Dentista não encontrado"),
    body("paciente").notEmpty().withMessage("Paciente não especificado"),
    body("local").notEmpty().withMessage("Local não especificado"),
    body("produto").exists().withMessage("Produto não especificado"),
    asyncHandler(async (req, res) => {
        console.log(req.body);
        const err = validationResult(req);
        const statusEntrega = req.body["status-entrega"] ? true : false;
        const serviço = new Serviço({
            dentista: req.body.dentista,
            produto: req.body.produto,
            paciente: req.body.paciente,
            local: req.body.local,
            statusEntrega: req.body.statusEntrega,
        });
        if (!err.isEmpty()) {
            // console.log(err.errors);
            const errors = {};
            err.errors.forEach((e) => {
                errors[e.path] = e.msg;
            });
            res.status(400).json({ errors });
        } else {
            // console.log(serviço);
            // await serviço.save();
            res.status(200).json({ message: "Serviço Saved", serviço });
        }
    }),
];
exports.detailsByLocal = asyncHandler(async (req, res) => {
    const serviço = await Serviço.find({ local: req.params.id })
        .populate("dentista")
        .populate("produto")
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
exports.detailsByDentist = asyncHandler(async (req, res) => {
    const serviço = await Serviço.find({ dentista: req.params.id }).exec();
    // console.log(serviço);
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
    body("dentista").isMongoId().withMessage("Dentista não encontrado"),
    body("paciente")
        .isLength({ min: 3 })
        .withMessage("Paciente não especificado"),

    asyncHandler(async (req, res) => {
        const err = validationResult(req);
        // console.log(req.body);
        if (req.body.produto.length < 1) {
            err.errors.push({
                msg: "Nenhum produto selecionado",
                path: "produto",
            });
        }
        // console.log(err);
        const update = Utility.emptyFields(req.body, true);

        if (!err.isEmpty()) {
            const errors = {};
            err.errors.forEach((e) => {
                errors[e.path] = e.msg;
            });
            res.status(400).json({ errors });
        } else {
            const serviço = await Serviço.findByIdAndUpdate(
                req.params.id,
                update,
                {
                    new: true,
                }
            ).exec();
            await serviço.save();
            res.status(200).json({ message: "Serviço Updated", serviço });
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

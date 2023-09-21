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
    asyncHandler(async (req, res) => {
        const err = validationResult(req);
        const serviço = new Serviço({
            dentista: req.body.dentista,
            produto: req.body.produto,
            paciente: req.body.paciente,
        });
        if (!err.isEmpty()) {
            // console.log(err.errors);
            const errors = {};
            err.errors.forEach((e) => {
                errors[e.path] = e.msg;
            });
            res.status(400).json({ errors });
        } else {
            // console.log("saved");
            // await serviço.save();
            res.status(200).json({ message: "Serviço Saved", serviço });
        }
    }),
];
exports.detailsByMonth = asyncHandler(async (req, res) => {
    const serviço = await Serviço.findById({ _id: req.params.id })
        .populate("dentista")
        .populate("produto")
        .exec();
    // if (!serviço) {
    //     res.status(404).json({
    //         message: "Serviço não foi encontrado",
    //     });
    // }
    // console.log(serviço);
    // res.status(200).json({
    //     serviço,
    // });
});
// Update
// Modificar um serviço
exports.editar = [
    body("dentista")
        .notEmpty()
        .withMessage("Dentista não especificado")
        .isMongoId()
        .withMessage("Dentista não encontrado"),
    body("paciente").notEmpty().withMessage("Paciente não especificado"),
    asyncHandler(async (req, res) => {
        console.log(req.body);
        const err = validationResult(req);
        const update = Utility.emptyFields(req.body, true);
        //'local' to be able to update need to return a id value at forms
        const serviço = await Serviço.findByIdAndUpdate(req.params.id, update, {
            new: true,
        }).exec();
        if (!err.isEmpty()) {
            const errors = {};
            err.errors.forEach((e) => {
                errors[e.path] = e.msg;
            });
            res.status(400).json({ errors });
        } else {
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

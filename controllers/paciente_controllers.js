const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Dentista = require("../models/dentista");
const Local = require("../models/local");
const Serviço = require("../models/serviço");
const Utility = require("../utils/utility");
const Paciente = require("../models/paciente");

// Route Test
exports.test = asyncHandler(async (req, res) => {
    res.json({ message: "Test Paciente" });
});
// Read
// Todos os pacientes
exports.todos = asyncHandler(async (req, res) => {
    const all = await Paciente.find().sort({ nome: 1 }).exec();
    if (!all) {
        res.sendStatus(404);
    }
    res.status(200).json({
        all,
    });
    // res.json({ message: "Not implemented 'todos locais'" });
});
// Detalhes sobre um paciente
exports.detalhes = asyncHandler(async (req, res) => {
    const paciente = await Paciente.findById(req.params.id)
        .populate("dentista")
        .populate("produto")
        .exec();
    if (!paciente) {
        res.status(404).json({
            message: "Paciente não foi encontrado pela ID",
        });
    }

    const serviço = await Serviço.find({ paciente: paciente._id }).exec();
    res.status(200).json({
        paciente,
        dentista: paciente.dentista,
        produto: paciente.produto,
        serviço,
    });
});
// Create
// Adicionar um novo paciente
exports.novo = [
    // Convert the produto to an array.
    (req, res, next) => {
        if (!(req.body.produto instanceof Array)) {
            if (typeof req.body.produto === "undefined") {
                req.body.produto = [];
            } else {
                req.body.produto = new Array(req.body.produto);
            }
        }
        next();
    },
    body("nome")
        .trim()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("O Nome tem que ser especificado"),
    body("dentista")
        .notEmpty()
        .withMessage("Dentista não especificado")
        .isMongoId()
        .withMessage("Dentista não encontrado na database"),
    asyncHandler(async (req, res) => {
        const err = validationResult(req);
        const paciente = new Paciente({
            nome: req.body.nome, //require true
            dentista: req.body.dentista,
            produto: req.body.produto,
        });
        if (!err.isEmpty()) {
            console.log(err.errors);
            res.json({ errors: err.errors });
        } else {
            // console.log("saved");
            await paciente.save();
            res.status(200).json({ message: "Paciente saved", paciente });
        }
    }),
];
// Update
// Modificar dados de um paciente
exports.editar = [
    body("nome")
        .trim()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("O Nome tem que ser especificado"),
    body("dentista")
        .notEmpty()
        .withMessage("Dentista não especificado")
        .isMongoId()
        .withMessage("Dentista não encontrado na database"),
    // Convert the produto to an array.
    (req, res, next) => {
        if (!(req.body.produto instanceof Array)) {
            if (typeof req.body.produto === "undefined") {
                req.body.produto = [];
            } else {
                req.body.produto = new Array(req.body.produto);
            }
        }
        next();
    },
    asyncHandler(async (req, res) => {
        const err = validationResult(req);
        const update = Utility.emptyFields(req.body);
        //'local' to be able to update need to return a id value at forms
        const paciente = await Paciente.findByIdAndUpdate(
            req.params.id,
            update,
            {
                new: true,
            }
        ).exec();
        if (!err.isEmpty()) {
            console.log(err.errors);
            res.json({ errors: err.errors });
        } else {
            await paciente.save();
            res.status(200).json({ message: "Paciente updated", paciente });
        }
    }),
];
// Delete
// Excluir um paciente
exports.deletar = asyncHandler(async (req, res) => {
    const [paciente, pacienteServices] = await Promise.all([
        Paciente.findById(req.params.id).exec(),
        Serviço.find({ paciente: req.params.id }),
    ]);
    if (pacienteServices.length > 0) {
        return res.status(409).json({
            status: "error",
            message:
                "Paciente cannot be deleted because there are associated with Serviço",
        });
    } else {
        await Paciente.findByIdAndRemove(req.params.id).exec();
        res.status(200).json({
            status: "success",
            message: "Paciente deletado.",
        });
    }
});

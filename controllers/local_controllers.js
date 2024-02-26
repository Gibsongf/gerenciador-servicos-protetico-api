const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Dentista = require("../models/dentista");
const Local = require("../models/local");
const Serviço = require("../models/serviço");
const Utility = require("../utils/utility");

// Route Test
exports.test = asyncHandler(async (req, res) => {
    res.json({ message: "Test Local" });
});

// Read
// Todos os locais
exports.todos = asyncHandler(async (req, res) => {
    const all = await Local.find().sort({ nome: 1 }).exec();
    if (!all) {
        res.sendStatus(404);
    }
    res.status(200).json({
        all,
    });
});
// Detalhes de um local
exports.detalhes = asyncHandler(async (req, res) => {
    const local = await Local.findById(req.params.id).exec();
    if (!local) {
        res.status(404);
    }
    const dentistas = await Dentista.find({ local: local._id }).exec();

    res.status(200).json({ local, dentistas });
});

// Create
// Adicionar um novo local
exports.novo = [
    body("nome").trim(),
    body("endereço")
        .trim()
        .notEmpty()
        .withMessage("Endereço tem que ser especificado"),
    body("telefone")
        .trim()
        .escape()
        .isNumeric()
        .withMessage("São aceito apenas números")
        //DDD SEMPRE 011
        .isLength({ max: 9, min: 8 })
        .withMessage("O Número deve ter 8 ou 9 dígitos."),
    body("cep")
        .notEmpty()
        .withMessage("Cep tem que ser especificado")
        .isPostalCode("BR")
        .withMessage("Cep Invalido."),
    asyncHandler(async (req, res) => {
        const err = validationResult(req);
        const local = new Local({
            nome: req.body.nome,
            endereço: req.body.endereço,
            tabela: req.body.tabela,
            telefone: req.body.telefone,
            cep: req.body.cep,
        });
        if (!err.isEmpty()) {
            const errors = {};
            err.errors.forEach((e) => {
                errors[e.path] = e.msg;
            });
            console.log(errors);

            res.status(400).json({ errors });
        } else {
            await local.save();
            res.status(200).json({
                message: "Local saved",
                local,
            });
        }
    }),
];
// Update
// Modificar um local existente
exports.editar = [
    body("nome").trim(),
    body("endereço")
        .trim()
        .notEmpty()
        .withMessage("Endereço tem que ser especificado"),
    body("telefone")
        .trim()
        .escape()
        .isString()
        .withMessage("São aceito apenas números")
        .isLength({ max: 10, min: 8 })
        .withMessage("O Número deve ter 8 ou 9 dígitos."),
    body("cep")
        .notEmpty()
        .withMessage("Cep tem que ser especificado")
        .isPostalCode("BR")
        .withMessage("Invalid Cep."),
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
            //'local' to be able to update need to return a id value at forms
            const local = await Local.findByIdAndUpdate(req.params.id, update, {
                new: true,
            }).exec();
            await local.save();
            res.status(200).json({ message: "Local updated", local });
        }
    }),
];

// Delete
// Deletar um local existente
exports.deletar = asyncHandler(async (req, res) => {
    const [local, dentistWorksInfo] = await Promise.all([
        Local.findById(req.params.id).exec(),
        Dentista.find({ local: req.params.id }),
    ]);
    if (dentistWorksInfo.length > 0) {
        // If there are associated Dentista, handle the response accordingly
        return res.status(409).json({
            status: "error",
            message:
                "Local não pode ser deletado pois possui Dentista relacionados a ele",
        });
    } else {
        await Local.findByIdAndRemove(req.params.id).exec();
        res.status(200).json({
            status: "success",
            message: "Local deletado.",
        });
    }
});

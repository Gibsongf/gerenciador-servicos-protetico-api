const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Dentista = require("../models/dentista");
const Local = require("../models/local");
const Serviço = require("../models/serviço");
const Utility = require("../utility");
// const Paciente = require("../models/paciente");

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
        todos_locais: all,
    });
    // res.json({ message: "Not implemented 'todos locais'" });
});
// Detalhes de um local
exports.detalhes = asyncHandler(async (req, res) => {
    const local = await Local.findById(req.params.id).exec();
    if (!local) {
        res.status(404).json({ message: "Local não foi encontrado pela ID" });
    }
    const dentistas = await Dentista.find({ local: local._id }).exec();

    res.status(200).json({ local, dentistas });
    // res.json({ message: "Not implemented 'detalhes local'" });
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
        .isString()
        .withMessage("São aceito apenas números")
        //DDD SEMPRE 011
        .isLength({ max: 10, min: 8 })
        .withMessage("O Número fornecido deve ter 8 ou 9 dígitos."),
    body("cep")
        .notEmpty()
        .withMessage("Cep tem que ser especificado")
        .isPostalCode("BR")
        .withMessage("Invalid Cep."),
    asyncHandler(async (req, res) => {
        const err = validationResult(req);

        const local = new Local({
            nome: req.body.nome,
            endereço: req.body.endereço,
            tipo_tabela: req.body.tipo_tabela,
            telefone: req.body.telefone,
            cep: req.body.cep,
        });

        if (!err.isEmpty()) {
            console.log(err.errors);
            res.json({ errors: err.errors });
        } else {
            console.log("saved");
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
        //DDD SEMPRE 011
        .isLength({ max: 10, min: 8 })
        .withMessage("O Número fornecido deve ter 8 ou 9 dígitos."),
    body("cep")
        .notEmpty()
        .withMessage("Cep tem que ser especificado")
        .isPostalCode("BR")
        .withMessage("Invalid Cep."),
    asyncHandler(async (req, res) => {
        const err = validationResult(req);
        const update = Utility.emptyFields(req.body);
        //'local' to be able to update need to return a id value at forms
        const local = await Local.findByIdAndUpdate(req.params.id, update, {
            new: true,
        }).exec();

        if (!err.isEmpty()) {
            res.json({ errors: err.errors });
        } else {
            await local.save();
            res.status(200).json({ message: "Local updated", local });
        }
    }),
];

// Delete
// Deletar um local existente
exports.deletar = asyncHandler(async (req, res) => {
    res.json({ message: "Not implemented 'deletar local'" });
});

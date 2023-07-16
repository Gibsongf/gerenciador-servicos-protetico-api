const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Dentista = require("../models/dentista");
const Local = require("../models/local");
const Serviço = require("../models/serviço");
const Utility = require("../utility");
const { ObjectId } = require("mongodb");
// Route Test
exports.test = asyncHandler(async (req, res) => {
    res.json({ message: "Test Dentista" });
});

exports.todos = asyncHandler(async (req, res) => {
    const all = await Dentista.find().exec(); //.sort({ nome: 1 })
    if (!all) {
        res.sendStatus(404);
    }
    res.status(200).json({
        todos_dentistas: all,
    });
});

exports.detalhes = asyncHandler(async (req, res) => {
    const dentista = await Dentista.findById(req.params.id)
        .populate("local")
        .exec();
    const serviços = await Serviço.find({ dentista: dentista._id })
        .populate("paciente")
        .populate("produto")
        .exec();
    if (!dentista) {
        res.sendStatus(404);
    }
    res.status(200).json({ dentista, serviços });
});
// isPostalCode(locale: 'BR'): ValidationChain CEP ?
exports.novo = [
    body("nome")
        .trim()
        .isLength({ min: 3 })
        .withMessage("O Nome tem que ser especificado"),
    body("sobrenome").trim(),
    body("local") //isMongoId()
        .trim()
        .not()
        .isEmpty()
        .withMessage("O Local tem que ser especificado"),
    body("telefone")
        .trim()
        .escape()
        .isString()
        .withMessage("São aceito apenas números")
        //DDD SEMPRE 011
        .isLength({ max: 10, min: 8 })
        .withMessage("O Número fornecido deve ter 8 ou 9 dígitos."),
    body("cpf")
        .trim()
        .escape()
        .isNumeric()
        .isLength({ max: 11, min: 11 })
        .withMessage("O CPF fornecido deve ter 11 dígitos."),
    asyncHandler(async (req, res) => {
        const err = validationResult(req);

        const local = await Local.findById(req.body.local).exec();
        // console.log(local, "local");
        const dentista = new Dentista({
            nome: req.body.nome, //require true
            sobrenome: req.body.sobrenome,
            tipo_de_tabela: { type: String, default: "Normal" },
            local: local._id, //require true
            celular: req.body.celular,
            cpf: req.body.cpf, //require true
        });

        if (!err.isEmpty()) {
            console.log(err.errors);
            res.json({ errors: err.errors });
        } else {
            // console.log("saved");
            await dentista.save();
            res.status(200).json({ message: "Dentista saved", dentista });
        }
    }),
];

exports.editar = [
    body("nome")
        .trim()
        .isLength({ min: 3 })
        .withMessage("O Nome tem que ser especificado"),
    body("sobrenome").trim(),
    body("local")
        .trim()
        .not()
        .isEmpty()
        .withMessage("O Local tem que ser especificado"),
    body("telefone")
        .trim()
        .escape()
        .isString()
        .withMessage("São aceito apenas números")
        //DDD SEMPRE 011
        .isLength({ max: 10, min: 8 })
        .withMessage("O Número fornecido deve ter 8 ou 9 dígitos."),
    body("cpf")
        .trim()
        .escape()
        .isNumeric()
        .isLength({ max: 11, min: 11 })
        .withMessage("O CPF fornecido deve ter 11 dígitos."),
    asyncHandler(async (req, res) => {
        const err = validationResult(req);
        const update = Utility.emptyFields(req.body);
        //'local' to be able to update need to return a id value at forms
        const dentista = await Dentista.findByIdAndUpdate(
            req.params.id,
            update,
            {
                new: true,
            }
        ).exec();

        if (!err.isEmpty()) {
            res.json({ errors: err.errors });
        } else {
            await dentista.save();
            res.status(200).json({ message: "Dentista updated", dentista });
        }
    }),
];

exports.deletar = asyncHandler(async (req, res) => {
    const dentista = await Dentista.findByIdAndRemove(req.params.id).exec();

    res.status(200).json({
        status: "success",
        message: "Dentista deletado .",
    });
});

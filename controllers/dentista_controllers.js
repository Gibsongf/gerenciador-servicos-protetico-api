const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Dentista = require("../models/dentista");
const Local = require("../models/local");
const Serviço = require("../models/serviço");
const Utility = require("../utils/utility");
// Route Test
exports.test = asyncHandler(async (req, res) => {
    res.json({ message: "Test Dentista" });
});

exports.todos = asyncHandler(async (req, res) => {
    const all = await Dentista.find()
        .sort({ nome: 1 })
        .populate("local")
        .exec(); //.sort({ nome: 1 })
    if (!all) {
        res.sendStatus(404);
    }
    res.status(200).json({
        all,
    });
});

exports.detalhes = asyncHandler(async (req, res) => {
    const dentista = await Dentista.findById(req.params.id)
        .populate("local")
        .exec();
    const serviços = await Serviço.find({ dentista: dentista._id })
        .populate("dentista")
        .populate("produto")
        .exec();
    if (!dentista) {
        res.sendStatus(404);
    }
    res.status(200).json({ dentista, serviços });
});
// isPostalCode(locale: 'BR'): ValidationChain CEP ?
exports.novo = [
    body("nome").trim().notEmpty().withMessage("O Nome não especificado"),
    body("sobrenome").trim(),
    body("local") //isMongoId()
        .trim()
        .notEmpty()
        .withMessage("O Local não especificado"),
    body("telefone")
        .trim()
        .escape()
        //DDD SEMPRE 011
        .isLength({ max: 9, min: 8 })
        .withMessage("O Número deve ter 8 ou 9 dígitos."),
    body("cpf")
        .trim()
        .escape()
        .isNumeric()
        .isLength({ max: 11, min: 11 })
        .withMessage("O CPF deve ter 11 dígitos."),
    asyncHandler(async (req, res) => {
        const err = validationResult(req);
        // console.log(err);
        if (!err.isEmpty()) {
            const errors = {};
            err.errors.forEach((e) => {
                errors[e.path] = e.msg;
            });
            res.status(400).json({ errors });
        } else {
            const local = await Local.findById(req.body.local).exec();
            const dentista = new Dentista({
                nome: req.body.nome, //require true
                sobrenome: req.body.sobrenome,
                local: local._id, //require true
                telefone: req.body.telefone,
                cpf: Number(req.body.cpf), //require true
            });

            await dentista.save();
            // console.log("saved");
            res.status(200).json({ message: "Dentista saved", dentista });
        }
    }),
];

exports.editar = [
    body("nome")
        .trim()
        .isLength({ min: 3 })
        .withMessage("O Nome não especificado"),
    body("sobrenome").trim(),
    body("local").trim().notEmpty().withMessage("O Local não especificado"),
    body("telefone")
        .trim()
        .escape()
        .isString()
        .withMessage("São aceito apenas números")
        //DDD SEMPRE 011
        .isLength({ max: 10, min: 8 })
        .withMessage("O Número deve ter 8 ou 9 dígitos."),
    body("cpf")
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
            const dentista = await Dentista.findByIdAndUpdate(
                req.params.id,
                update,
                {
                    new: true,
                }
            ).exec();
            await dentista.save();
            res.status(200).json({ message: "Dentista updated", dentista });
        }
    }),
];

exports.deletar = asyncHandler(async (req, res) => {
    const [dentista, dentistServices] = await Promise.all([
        Dentista.findById(req.params.id).exec(),
        Serviço.find({ dentista: req.params.id }),
    ]);
    if (dentistServices.length > 0) {
        // If there are associated "Serviço", handle the response accordingly
        return res.status(409).json({
            status: "error",
            message:
                "Dentista cannot be deleted because there are associated Serviço",
        });
    } else {
        await Dentista.findByIdAndRemove(req.params.id).exec();
        res.status(200).json({
            status: "success",
            message: "Dentista deletado.",
        });
    }
});

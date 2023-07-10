const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Dentista = require("../models/dentista");
const Local = require("../models/local");
const Serviço = require("../models/serviço");
const Utility = require("../utility");
const Paciente = require("../models/paciente");

// Read
// Todos os serviços
exports.todos = asyncHandler(async (req, res) => {
    res.send("Not implemented 'todos serviços'");
});
// Detalhes de um serviço
exports.detalhes = asyncHandler(async (req, res) => {
    res.send("Not implemented 'detalhes serviço'");
});
// Create
// Adicionar um novo serviço
exports.novo = asyncHandler(async (req, res) => {
    res.send("Not implemented 'novo serviço'");
});
// Update
// Modificar um serviço
exports.modificar = asyncHandler(async (req, res) => {
    res.send("Not implemented 'modificar serviço'");
});
// Delete
// Deletar um serviço
exports.deletar = asyncHandler(async (req, res) => {
    res.send("Not implemented 'deletar serviço'");
});

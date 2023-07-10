const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Dentista = require("../models/dentista");
const Local = require("../models/local");
const Serviço = require("../models/serviço");
const Utility = require("../utility");
const Paciente = require("../models/paciente");

// Read
// Todos os locais
exports.todos = asyncHandler(async (req, res) => {
    res.send("Not implemented 'todos locais'");
});
// Detalhes de um local
exports.detalhes = asyncHandler(async (req, res) => {
    res.send("Not implemented 'detalhes local'");
});

// Create
// Adicionar um novo local
exports.novo = asyncHandler(async (req, res) => {
    res.send("Not implemented 'novo local'");
});

// Update
// Modificar um local existente
exports.modificar = asyncHandler(async (req, res) => {
    res.send("Not implemented 'modificar local'");
});

// Delete
// Deletar um local existente
exports.deletar = asyncHandler(async (req, res) => {
    res.send("Not implemented 'deletar local'");
});

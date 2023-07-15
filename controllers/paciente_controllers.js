const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Dentista = require("../models/dentista");
const Local = require("../models/local");
const Serviço = require("../models/serviço");
const Utility = require("../utility");
const Paciente = require("../models/paciente");

// Route Test
exports.test = asyncHandler(async (req, res) => {
    res.json({ message: "Test Paciente" });
});
// Read
// Todos os pacientes
exports.todos = asyncHandler(async (req, res) => {
    res.send("Not implemented 'todos pacientes'");
});
// Detalhes sobre um paciente
exports.detalhes = asyncHandler(async (req, res) => {
    res.send("Not implemented 'detalhes paciente'");
});
// Create
// Adicionar um novo paciente
exports.novo = asyncHandler(async (req, res) => {
    res.send("Not implemented 'novo paciente'");
});
// Update
// Modificar dados de um paciente
exports.editar = asyncHandler(async (req, res) => {
    res.send("Not implemented 'modificar paciente'");
});
// Delete
// Excluir um paciente
exports.deletar = asyncHandler(async (req, res) => {
    res.send("Not implemented 'deletar paciente'");
});

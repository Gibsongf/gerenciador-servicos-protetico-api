const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Dentista = require("../models/dentista");
const Local = require("../models/local");
const Serviço = require("../models/serviço");
const Utility = require("../utility");
const Paciente = require("../models/paciente");

// Route Test
exports.test = asyncHandler(async (req, res) => {
    res.json({ message: "Test Produto" });
});

// Read
// Todos os produtos
exports.todos = asyncHandler(async (req, res) => {
    res.send("Not implemented 'todos produtos'");
});
// Detalhes de um produto
exports.detalhes = asyncHandler(async (req, res) => {
    res.send("Not implemented 'detalhes produto'");
});
// Create
// Adicionar um novo produto
exports.novo = asyncHandler(async (req, res) => {
    res.send("Not implemented 'novo produto'");
});
// Update
// Modificar um produto existente
exports.modificar = asyncHandler(async (req, res) => {
    res.send("Not implemented 'modificar produto'");
});
// Delete
// Deletar um produto
exports.deletar = asyncHandler(async (req, res) => {
    res.send("Not implemented 'deletar produto'");
});

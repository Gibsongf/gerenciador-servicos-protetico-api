const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Dentista = require("../models/dentista");
const Local = require("../models/local");
const Serviço = require("../models/serviço");
const Utility = require("../utility");
const Paciente = require("../models/paciente");

// Read
// Todos os produtos
exports.todos = asyncHandler(async (req, res) => {});
// Detalhes de um produto
exports.detalhes = asyncHandler(async (req, res) => {});
// Create
// Adicionar um novo produto
exports.novo = asyncHandler(async (req, res) => {});
// Update
// Modificar um produto existente
exports.modificar = asyncHandler(async (req, res) => {});
// Delete
// Deletar um produto
exports.deletar = asyncHandler(async (req, res) => {});

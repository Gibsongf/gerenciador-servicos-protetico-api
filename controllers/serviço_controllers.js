const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Dentista = require("../models/dentista");
const Local = require("../models/local");
const Serviço = require("../models/serviço");
const Utility = require("../utility");
const Paciente = require("../models/paciente");

// Read
// Todos os serviços
exports.todos = asyncHandler(async (req, res) => {});
// Detalhes de um serviço
exports.detalhes = asyncHandler(async (req, res) => {});
// Create
// Adicionar um novo serviço
exports.novo = asyncHandler(async (req, res) => {});
// Update
// Modificar um serviço
exports.modificar = asyncHandler(async (req, res) => {});
// Delete
// Deletar um serviço
exports.deletar = asyncHandler(async (req, res) => {});

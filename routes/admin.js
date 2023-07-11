const express = require("express");
const dentista_controllers = require("../controllers/dentista_controllers");
const paciente_controllers = require("../controllers/paciente_controllers");
const local_controllers = require("../controllers/local_controllers");
const serviço_controllers = require("../controllers/serviço_controllers");
const produto_controllers = require("../controllers/produto_controllers");
const router = express.Router();

/* GET users listing. */
router.get("/todos", dentista_controllers.todos);

module.exports = router;

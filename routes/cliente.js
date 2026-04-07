const express = require("express");
const cliente_controllers = require("../controllers/cliente_controllers");
const router = express.Router();

// GET
router.get("/todos", cliente_controllers.todos);
router.get("/:id", cliente_controllers.detalhes);

// POST
router.post("/novo", cliente_controllers.novo);

// PUT
router.put("/:id/edit", cliente_controllers.editar);

// DELETE
router.delete("/:id", cliente_controllers.deletar);

module.exports = router;

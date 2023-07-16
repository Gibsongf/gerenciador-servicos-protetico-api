const express = require("express");
const paciente_controllers = require("../controllers/paciente_controllers");
const router = express.Router();

// GET
router.get("/todos", paciente_controllers.todos);
router.get("/:id", paciente_controllers.detalhes);

// POST
router.post("/novo", paciente_controllers.novo);

// PUT
router.put("/:id/edit", paciente_controllers.editar);

// DELETE
router.delete("/:id", paciente_controllers.deletar);

module.exports = router;

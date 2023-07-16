const express = require("express");
const produto_controllers = require("../controllers/produto_controllers");
const router = express.Router();

/*Paciente Route */
// GET
router.get("/todos", produto_controllers.todos);
router.get("/:id", produto_controllers.detalhes);
// POST
router.post("/novo", produto_controllers.novo);
// PUT
router.put("/:id/edit", produto_controllers.editar);
// DELETE
router.delete("/:id", produto_controllers.deletar);

module.exports = router;

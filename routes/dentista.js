const express = require("express");
const dentista_controllers = require("../controllers/dentista_controllers");
const router = express.Router();

// GET
router.get("/todos", dentista_controllers.todos);
router.get("/:id", dentista_controllers.detalhes);

// POST
router.post("/novo", dentista_controllers.novo);

// PUT
router.put("/:id/edit", dentista_controllers.editar);

// DELETE
router.delete("/:id", dentista_controllers.deletar);

module.exports = router;

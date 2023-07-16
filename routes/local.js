const express = require("express");
const local_controllers = require("../controllers/local_controllers");
const router = express.Router();

// GET
router.get("/todos", local_controllers.todos);
router.get("/:id", local_controllers.detalhes);

// POST
router.post("/novo", local_controllers.novo);

// PUT
router.put("/:id/edit", local_controllers.editar);

// DELETE
router.delete("/:id", local_controllers.deletar);

module.exports = router;

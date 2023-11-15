const express = require("express");
const serviço_controllers = require("../controllers/serviço_controllers");
const router = express.Router();

/*Serviço Route */
// GET
router.get("/todos", serviço_controllers.todos);
// router.get("/todos/:mes/:id", serviço_controllers.detalhes);
router.get("/todos/:local", serviço_controllers.detailsByLocal);

router.get("/:id", serviço_controllers.detalhes);

// POST
router.post("/novo", serviço_controllers.novo);

// PUT
router.put("/:id/edit", serviço_controllers.editar);

// DELETE
router.delete("/:id", serviço_controllers.deletar);

module.exports = router;

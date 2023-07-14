const express = require("express");
const dentista_controllers = require("../controllers/dentista_controllers");
const paciente_controllers = require("../controllers/paciente_controllers");
const local_controllers = require("../controllers/local_controllers");
const serviço_controllers = require("../controllers/serviço_controllers");
const produto_controllers = require("../controllers/produto_controllers");
const router = express.Router();
// GET for Test
router.get("/test-dentistas", dentista_controllers.test);
router.get("/test-locais", local_controllers.test);
router.get("/test-pacientes", paciente_controllers.test);
router.get("/test-serviços", serviço_controllers.test);
router.get("/test-produtos", produto_controllers.test);

/*Dentista Route */
// GET
router.get("/todos-dentistas", dentista_controllers.todos);
router.get("/dentista/:id", dentista_controllers.detalhes);
// POST
router.post("/dentista/novo", dentista_controllers.novo);
// PUT
router.put("/dentista/:id/edit", dentista_controllers.edit);
// DELETE
router.delete("/dentista/:id", dentista_controllers.deletar);

router.get("/todos-locais", local_controllers.todos);
router.get("/todos-pacientes", paciente_controllers.todos);
router.get("/todos-serviços", serviço_controllers.todos);
router.get("/todos-produtos", produto_controllers.todos);

module.exports = router;

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
router.put("/dentista/:id/edit", dentista_controllers.editar);
// DELETE
router.delete("/dentista/:id", dentista_controllers.deletar);

/*Local Route */
// GET
router.get("/todos-locais", local_controllers.todos);
router.get("/local/:id", local_controllers.detalhes);
// POST
router.post("/local/novo", local_controllers.novo);
// PUT
router.put("/local/:id/edit", local_controllers.editar);
// DELETE
router.delete("/local/:id", local_controllers.deletar);

/*Produto Route */
// GET
router.get("/todos-produtos", produto_controllers.todos);
router.get("/produto/:id", produto_controllers.detalhes);
// POST
router.post("/produto/novo", produto_controllers.novo);
// PUT
router.put("/produto/:id/edit", produto_controllers.editar);
// DELETE
router.delete("/produto/:id", produto_controllers.deletar);

/*Paciente Route */
// GET
router.get("/todos-pacientes", paciente_controllers.todos);
router.get("/paciente/:id", paciente_controllers.detalhes);
// POST
router.post("/paciente/novo", paciente_controllers.novo);
// PUT
router.put("/paciente/:id/edit", paciente_controllers.editar);
// DELETE
router.delete("/paciente/:id", paciente_controllers.deletar);

/*Serviço Route */
// // GET
// router.get("/todos-servicos", serviço_controllers.todos);
// router.get("/servico/:id", serviço_controllers.detalhes);
// // POST
// router.post("/servico/novo", serviço_controllers.novo);
// // PUT
// router.put("/servico/:id/edit", serviço_controllers.editar);
// // DELETE
// router.delete("/servico/:id", serviço_controllers.deletar);

router.use("/servico", require("./serviço"));
module.exports = router;

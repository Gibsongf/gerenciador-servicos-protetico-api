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
// router.get("/test-pacientes", paciente_controllers.test);
router.get("/test-serviços", serviço_controllers.test);
router.get("/test-produtos", produto_controllers.test);

// Main API route
router.use("/servico", require("./serviço"));
// router.use("/paciente", require("./paciente"));
router.use("/produto", require("./produto"));
router.use("/local", require("./local"));
router.use("/dentista", require("./dentista"));
router.use("/export", require("./exportExcel"));
module.exports = router;

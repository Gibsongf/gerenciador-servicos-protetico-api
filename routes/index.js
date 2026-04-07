const express = require("express");
const router = express.Router();

// here will show the login page and just that
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Gerenciamento Protético" });
});

module.exports = router;

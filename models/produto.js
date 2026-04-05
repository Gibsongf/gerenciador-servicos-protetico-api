const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProdutoSchema = new Schema({
  nome: { type: String, required: true },
  valor_normal: { type: Number, required: true },
  valor_reduzido: { type: Number },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Produto", ProdutoSchema);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProdutoSchema = new Schema({
    nome: { type: String, require: true },
    valor_normal: { type: Number, require: true },
    valor_reduzido: { type: Number },
    // tabela:{type: Schema.Types.ObjectId} ver como sera chamado as tabelas de preços cada produto tem dois valores
});

module.exports = mongoose.model("Produto", ProdutoSchema);

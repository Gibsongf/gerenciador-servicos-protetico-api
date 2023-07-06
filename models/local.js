const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LocalSchema = new Schema({
    //franquia ou nome ?
    franquia: { type: String },
    nome: { type: String },
    endereço: { type: String, require: true },
    cep: { type: Number, maxLength: 8, minLength: 8, require: true },
    dentistas: [{ type: Schema.Types.ObjectId }],
    telefone: { type: Number, required: true },
    // serviços: { type: Schema.Types.ObjectId },
    // tipo_de_tabela: { type: String, default: "Normal" },
});

module.exports = mongoose.model("Local", LocalSchema);

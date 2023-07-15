const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LocalSchema = new Schema({
    //franquia ou nome ?
    nome: { type: String },
    endereço: { type: String, require: true },
    cep: { type: String, maxLength: 9, minLength: 9, require: true },
    // should do this at the local controllers
    // dentistas: [{ type: Schema.Types.ObjectId }],
    telefone: { type: String, maxLength: 10, minLength: 8 },
    tipo_tabela: {
        type: String,
        enum: ["Normal", "Reduzido"],
        default: "Normal",
    },
});

module.exports = mongoose.model("Local", LocalSchema);

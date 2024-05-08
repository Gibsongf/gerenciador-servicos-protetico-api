const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LocalSchema = new Schema({
    nome: { type: String },
    endereço: { type: String, require: true },
    cep: { type: String, maxLength: 9 },
    telefone: { type: String, maxLength: 14 },
    tabela: {
        type: String,
        enum: ["Normal", "Reduzido"],
        default: "Normal",
    },
});

module.exports = mongoose.model("Local", LocalSchema);

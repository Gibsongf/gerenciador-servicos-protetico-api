const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LocalSchema = new Schema({
    nome: { type: String },
    endereço: { type: String, require: true },
    cep: { type: String, maxLength: 9, minLength: 8, require: true },
    telefone: { type: String, maxLength: 14, minLength: 13 },
    tabela: {
        type: String,
        enum: ["Normal", "Reduzido"],
        default: "Normal",
    },
});

module.exports = mongoose.model("Local", LocalSchema);

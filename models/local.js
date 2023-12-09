const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LocalSchema = new Schema({
    nome: { type: String },
    endereço: { type: String, require: true },
    cep: { type: String, maxLength: 9, minLength: 9, require: true },
    telefone: { type: String, maxLength: 9, minLength: 8 },
    tabela: {
        type: String,
        enum: ["Normal", "Reduzido"],
        default: "Normal",
    },
});

module.exports = mongoose.model("Local", LocalSchema);

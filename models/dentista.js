const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DentistaSchema = new Schema({
    nome: { type: String, require: true },
    sobrenome: { type: String },
    //serviços ou encomendas ?
    serviços: { type: Schema.Types.ObjectId },
    tipo_de_tabela: { type: String, default: "Normal" },
    local: { type: Schema.Types.ObjectId, require: true },
    celular: { type: Number },
    cpf: {
        type: String,
        required: true,
        unique: true,
        maxLength: 11,
        minLength: 11,
    },
});

module.exports = mongoose.model("Dentista", DentistaSchema);

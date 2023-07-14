const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DentistaSchema = new Schema({
    nome: { type: String, require: true, minLength: 3 },
    sobrenome: { type: String },
    //serviços ou encomendas ?
    // serviços: { type: Schema.Types.ObjectId },
    local: { type: Schema.Types.ObjectId, require: true },
    telefone: { type: String, maxLength: 10, minLength: 8 },
    cpf: {
        type: Number,
        required: true,
        unique: true,
        maxLength: 11,
        minLength: 11,
    },
});

module.exports = mongoose.model("Dentista", DentistaSchema);

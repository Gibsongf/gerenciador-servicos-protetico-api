const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DentistaSchema = new Schema({
    nome: { type: String, require: true, minLength: 3 },
    sobrenome: { type: String },
    local: { type: Schema.Types.ObjectId, ref: "Local", require: true },
    telefone: { type: String, maxLength: 14, minLength: 13 },
    cpf: {
        type: String,
        unique: true,
        maxLength: 11,
        minLength: 11,
    },
});

module.exports = mongoose.model("Dentista", DentistaSchema);

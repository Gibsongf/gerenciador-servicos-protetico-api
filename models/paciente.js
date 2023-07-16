const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PacienteSchema = new Schema({
    nome: { type: String, require: true },
    sobrenome: { type: String },
    dentista: { type: Schema.Types.ObjectId, ref: "Dentista", require: true },
    produto: [{ type: Schema.Types.ObjectId, ref: "Produto" }],
});

module.exports = mongoose.model("Paciente", PacienteSchema);

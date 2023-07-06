const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PacienteSchema = new Schema({
    nome: { type: String, require: true },
    sobrenome: { type: String },

    dentista: { type: Schema.Types.ObjectId, require: true },
    produto: [{ type: Schema.Types.ObjectId }],
    // tipo_de_tabela: { type: String, default: "Normal" },
});

module.exports = mongoose.model("Paciente", PacienteSchema);

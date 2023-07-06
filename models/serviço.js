const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// we can make a func that will return the total value of all product here or as a middleware
const ServiçoSchema = new Schema({
    dentista: { type: Schema.Types.ObjectId, require: true },
    paciente: { type: Schema.Types.ObjectId, require: true },
    produto: [{ type: Schema.Types.ObjectId }],
    statusEntrega: { type: Boolean, require: true },
    // tipo_de_tabela: { type: String, default: "Normal" },
});

module.exports = mongoose.model("Serviço", ServiçoSchema);

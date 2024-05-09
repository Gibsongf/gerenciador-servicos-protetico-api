const mongoose = require("mongoose");
const { format } = require("date-fns");

const Schema = mongoose.Schema;

const ServiçoSchema = new Schema({
    cliente: { type: Schema.Types.ObjectId, ref: "Cliente", require: true },
    local: { type: Schema.Types.ObjectId, ref: "Local", require: true },
    paciente: { type: String, require: true, minLength: 3 },
    produto: [{ type: Schema.Types.ObjectId, ref: "Produto" }],
    dataRegistro: { type: Date, default: new Date() },
    statusEntrega: { type: Boolean, require: true, default: false },
});

module.exports = mongoose.model("Serviço", ServiçoSchema);

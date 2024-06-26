const mongoose = require("mongoose");
const { format } = require("date-fns");

const Schema = mongoose.Schema;

const ServiçoSchema = new Schema({
    dentista: { type: Schema.Types.ObjectId, ref: "Dentista", require: true },
    local: { type: Schema.Types.ObjectId, ref: "Local", require: true },
    paciente: { type: String, require: true, minLength: 3 },
    produto: [{ type: Schema.Types.ObjectId, ref: "Produto" }],
    dataRegistro: { type: Date, default: new Date() },
    statusEntrega: { type: Boolean, require: true, default: false },
});

module.exports = mongoose.model("Serviço", ServiçoSchema);

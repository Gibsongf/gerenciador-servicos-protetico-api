const mongoose = require("mongoose");
const { format } = require("date-fns");

const Schema = mongoose.Schema;

const ServiçoSchema = new Schema({
  cliente: { type: Schema.Types.ObjectId, ref: "Cliente", required: true },
  local: { type: Schema.Types.ObjectId, ref: "Local", required: true },
  paciente: { type: String, required: true, minLength: 3 },
  produtos: [
    {
      produto: { type: Schema.Types.ObjectId, ref: "Produto", required: true },
      quantidade: { type: Number, min: 1 },
    },
  ],
  dataRegistro: { type: Date, default: new Date() },
  statusEntrega: { type: Boolean, required: true, default: false },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Serviço", ServiçoSchema);

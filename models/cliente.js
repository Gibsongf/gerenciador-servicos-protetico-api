const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ClienteSchema = new Schema({
  nome: { type: String, required: true, minLength: 3 },
  local: { type: Schema.Types.ObjectId, ref: "Local", required: true },
  telefone: { type: String, maxLength: 14 },
  cpf: {
    type: String,
    maxLength: 11,
  },
});

module.exports = mongoose.model("Cliente", ClienteSchema);

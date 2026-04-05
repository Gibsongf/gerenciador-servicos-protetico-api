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
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});
ClienteSchema.virtual("serviços", {
  ref: "Serviço",
  localField: "_id",
  foreignField: "cliente",
});

ClienteSchema.set("toJSON", { virtuals: true });
ClienteSchema.set("toObject", { virtuals: true });
module.exports = mongoose.model("Cliente", ClienteSchema);

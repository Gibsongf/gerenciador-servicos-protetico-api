const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LocalSchema = new Schema({
  nome: { type: String },
  endereço: { type: String, required: true },
  cep: { type: String, maxLength: 9 },
  telefone: { type: String, maxLength: 14 },
  tabela: {
    type: String,
    enum: ["Normal", "Reduzido"],
    default: "Normal",
  },
});
LocalSchema.virtual("clientes", {
  ref: "Cliente",
  localField: "_id",
  foreignField: "local",
});
LocalSchema.virtual("serviços", {
  ref: "Serviço",
  localField: "_id",
  foreignField: "local",
});
LocalSchema.set("toJSON", { virtuals: true });
LocalSchema.set("toObject", { virtuals: true });
module.exports = mongoose.model("Local", LocalSchema);

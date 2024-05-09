const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ClienteSchema = new Schema({
    nome: { type: String, require: true, minLength: 3 },
    local: { type: Schema.Types.ObjectId, ref: "Local", require: true },
    telefone: { type: String, maxLength: 14 },
    cpf: {
        type: String,
        maxLength: 11,
    },
});

module.exports = mongoose.model("Cliente", ClienteSchema);

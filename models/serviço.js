const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const formattedDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    // const day = String(currentDate.getDate()).padStart(2, "0");

    return `${year}-${month}`;
};

// we can make a func that will return the total value of all product here or as a middleware
const ServiçoSchema = new Schema({
    dentista: { type: Schema.Types.ObjectId, ref: "Dentista", require: true },
    local: { type: Schema.Types.ObjectId, ref: "Local", require: true },
    paciente: { type: String, require: true, minLength: 3 },
    produto: [{ type: Schema.Types.ObjectId, ref: "Produto" }],
    dataRegistro: { type: Date, default: formattedDate },
    statusEntrega: { type: Boolean, require: true, default: false },
});

module.exports = mongoose.model("Serviço", ServiçoSchema);

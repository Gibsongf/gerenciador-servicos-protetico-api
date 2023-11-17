const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const getMonthName = () => {
    const month = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
    ];
    const d = new Date();
    let name = month[d.getMonth()];
    return name;
};

// we can make a func that will return the total value of all product here or as a middleware
const ServiçoSchema = new Schema({
    dentista: { type: Schema.Types.ObjectId, ref: "Dentista", require: true },
    local: { type: Schema.Types.ObjectId, ref: "Local", require: true },
    paciente: { type: String, require: true, minLength: 3 },
    produto: [{ type: Schema.Types.ObjectId, ref: "Produto" }],
    dataRegistro: { type: Date, default: Date.now },
    statusEntrega: { type: Boolean, require: true, default: false },
});

module.exports = mongoose.model("Serviço", ServiçoSchema);

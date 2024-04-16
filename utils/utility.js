// const mongoose = require("mongoose");
// mongoose.set("strictQuery", false);

// to remove new ObjectId from a mongodb object
// const { ObjectId } = require("mongodb");
// const objectIdString = new ObjectId().toHexString(data.dentista._id);
exports.fullName = (dentista) => {
    // To avoid errors in cases where an author does not have either a family name or first name
    // We want to make sure we handle the exception by returning an empty string for that case
    let fullName = "";
    if (dentista.nome && dentista.sobrenome) {
        fullName = `${dentista.nome} ${dentista.sobrenome}`;
    }
    if (!dentista.nome || !dentista.sobrenome) {
        fullName = "";
    }
    return fullName;
};
exports.emptyFields = (obj, underline) => {
    const newObj = {};
    const keys = Object.keys(obj);
    keys.forEach((k) => {
        if (obj[k]) {
            newObj[k] = obj[k];
        }
    });
    console.log(newObj);
    return newObj;
};
exports.formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const options = {
        year: "numeric",
        month: "long",
    };
    const format_date = date.toLocaleString("pt-BR", options);
    return format_date;
};

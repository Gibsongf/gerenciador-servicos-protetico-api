const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

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
    // console.log(keys);
    keys.forEach((k) => {
        if (obj[k].length > 0) {
            if (underline) {
                // console.log(obj[k], k);
                const newK = k.replace(" ", "_");
                newObj[newK] = obj[k];
            } else {
                newObj[k] = obj[k];
            }
        }
    });
    return newObj;
};

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

// to remove new ObjectId from a mongodb object
// const { ObjectId } = require("mongodb");
// const objectIdString = new ObjectId().toHexString(data.dentista._id);

exports.emptyFields = (obj) => {
    const newObj = {};
    const keys = Object.keys(obj);
    keys.forEach((k) => {
        if (obj[k].length > 0) {
            newObj[k] = obj[k];
        }
    });
    return newObj;
};

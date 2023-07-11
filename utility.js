require("dotenv").config();
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

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

exports.connectDB = () => {
    const mongoDB = process.env.MONGODB;
    async function main() {
        await mongoose.connect(mongoDB);
    }
    main().catch((err) => console.log(err));
};

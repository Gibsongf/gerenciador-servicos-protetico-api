const {
    createDentista,
    createLocal,
    createProduto,
    createServiço,
    storeRealProducts,
} = require("../utils/createData");
const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set("strictQuery", false);

async function main() {
    const dentistaArray = [];
    const produtoArray = [];
    await mongoose.connect(mongoDB);
    const collections = mongoose.connection.collections;
    //empty db before populate
    //need to register user again
    await Promise.all(
        Object.values(collections).map(async (collection) => {
            console.log(collection.name);
            // an empty mongodb selector object ({}) must be passed as the filter argument
            await collection.deleteMany({});
        })
    );

    for (let i = 0; i < 5; i++) {
        const local = await createLocal();
        await createDentista(local._id, dentistaArray);
    }
    await storeRealProducts(produtoArray);
    // console.log(produtoArray);
    // console.log("local, dentista, produto saved");
    let day = 1;
    let date = () => `2024-04-${day}`;
    for (let i = 0; i < 10; i++) {
        await createServiço(dentistaArray, produtoArray, date());
        // console.log(date());
        day++;
    }
    console.log("serviço saved");

    mongoose.connection.close();
}

const mongoDB = process.env.MONGODB;
main().catch((err) => console.log(err));

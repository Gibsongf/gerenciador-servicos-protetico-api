const {
    createCliente,
    createLocal,
    createProduto,
    createServiço,
    realProducts,
    realLocal,
} = require("../utils/createData");
const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set("strictQuery", false);

async function main() {
    const clienteArray = [];
    const produtoArray = [];
    const localArray = [];

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
    await realLocal(localArray);
    console.log(localArray);
    for (let i = 0; i < localArray.length; i++) {
        // const local = await createLocal();
        await createCliente(localArray[i]._id, clienteArray);
    }
    await realProducts(produtoArray);
    // console.log("local, cliente, produto saved");
    let day = 1;
    let date = () => `2024-04-${day}`;
    for (let i = 0; i < 10; i++) {
        await createServiço(clienteArray, produtoArray, date());
        day++;
    }
    console.log("serviço saved");

    mongoose.connection.close();
}

const mongoDB = process.env.MONGODB;
main().catch((err) => console.log(err));

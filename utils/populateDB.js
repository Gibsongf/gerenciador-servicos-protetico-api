const { faker } = require("@faker-js/faker/locale/pt_BR");
const Dentista = require("../models/dentista");
const Serviço = require("../models/serviço");
const Local = require("../models/local");
const Produto = require("../models/produto");
const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set("strictQuery", false);

const produtoArray = [];
const dentistaArray = [];
const randomNumber = (array) => {
    if (array.length === 1) {
        return 0;
    }
    const indx = Math.floor(Math.random() * array.length);
    return indx;
};

async function main() {
    await mongoose.connect(mongoDB);
    const collections = mongoose.connection.collections;

    await Promise.all(
        Object.values(collections).map(async (collection) => {
            await collection.deleteMany({}); // an empty mongodb selector object ({}) must be passed as the filter argument
        })
    );

    for (let i = 0; i < 5; i++) {
        const local = await createLocal();
        await createDentista(local._id);
        await createProduto();
    }
    for (let i = 0; i < 10; i++) {
        await createServiço();
    }

    mongoose.connection.close();
}

const mongoDB = process.env.MONGODB;
main().catch((err) => console.log(err));
async function populateTest() {
    const local = await createLocal();
    const dentista = await createDentista(local._id);
    const produto = await createProduto();
    const serviço = await createServiço();
    return { local, dentista, produto, serviço };
}
const createDentista = async (local_id) => {
    const dentista = new Dentista({
        nome: faker.person.firstName(),
        sobrenome: faker.person.lastName(),
        local: local_id,
        telefone: String(faker.phone.number("####-####")),
        cpf: String(faker.phone.number("###########")),
    });
    await dentista.save();
    dentistaArray.push(dentista);

    return dentista;
};

const createLocal = async () => {
    const opt = ["Normal", "Reduzido"];
    const type = opt[randomNumber(opt)];
    const local = new Local({
        nome: faker.company.name(),
        endereço: faker.location.streetAddress(),
        tipo_tabela: type,
        cep: faker.location.zipCode(),
        telefone: String(faker.phone.number("####-####")),
    });
    await local.save();
    //console.log("Created Local!");
    return local;
};
const createProduto = async () => {
    const produto = new Produto({
        nome: faker.commerce.productName(),
        valor_normal: faker.commerce.price({ min: 100, max: 200 }),
        valor_reduzido: faker.commerce.price({ max: 100 }),
    });
    await produto.save();
    produtoArray.push(produto);
    //console.log("Created produto!");

    return produto;
};
const createServiço = async () => {
    const dentista = dentistaArray[randomNumber(dentistaArray)];
    const produto = produtoArray[randomNumber(produtoArray)];
    const produto2 = produtoArray[randomNumber(produtoArray)];

    const serviço = new Serviço({
        dentista: dentista._id,
        paciente: faker.person.fullName(),
        produto: [produto._id, produto2._id],
        local: dentista.local._id,
        statusEntrega: false,
    });
    await serviço.save();
    //console.log("Created Serviço!");
    return serviço;
};

// module.exports = populateTest;

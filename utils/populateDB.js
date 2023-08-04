const { faker } = require("@faker-js/faker/locale/pt_BR");
const Dentista = require("../models/dentista");
const Serviço = require("../models/serviço");
const Local = require("../models/local");
const Produto = require("../models/produto");
const Paciente = require("../models/paciente");
const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set("strictQuery", false);

const produtoArray = [];
const dentistaArray = [];
const pacienteArray = [];
const randomNumber = (array) => {
    if (array.length === 1) {
        return 0;
    }
    const indx = Math.floor(Math.random() * array.length);
    return indx;
};
async function main() {
    await mongoose.connect(mongoDB);
    for (let i = 0; i < 5; i++) {
        const local = await createLocal();
        await createDentista(local._id);
        await createProduto();
    }
    await createPaciente();
    await createServiço();
    mongoose.connection.close();
}

// const mongoDB = process.env.MONGODB;
// main().catch((err) => console.log(err));
async function populateTest() {
    const local = await createLocal();
    const dentista = await createDentista(local._id);
    const produto = await createProduto();
    const paciente = await createPaciente();
    const serviço = await createServiço();
    return { local, dentista, produto, paciente, serviço };
}
const createDentista = async (local_id) => {
    const dentista = new Dentista({
        nome: faker.person.firstName(),
        local: local_id,
        telefone: String(faker.phone.number("####-####")),
        cpf: String(faker.phone.number("###########")),
    });
    await dentista.save();
    dentistaArray.push(dentista);
    //console.log("Created Dentinsta!");

    return dentista;
};

const createLocal = async () => {
    const opt = ["Normal", "Reduzido"];
    const type = opt[randomNumber(opt)];
    const local = new Local({
        nome: faker.company.name(),
        endereço: faker.location.streetAddress(),
        tipo_de_tabela: type,
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
const createPaciente = async () => {
    const dentista = dentistaArray[0];
    const produto = produtoArray[0];

    const paciente = new Paciente({
        nome: faker.person.firstName(),
        dentista: dentista._id,
        produto: [produto._id],
    });
    pacienteArray.push(paciente);
    await paciente.save();
    //console.log("Created Paciente!");
    return paciente;
};
const createServiço = async () => {
    const paciente = pacienteArray[0];

    const serviço = new Serviço({
        dentista: paciente.dentista._id,
        paciente: paciente._id,
        produto: [paciente.produto],
        statusEntrega: false,
    });
    await serviço.save();
    //console.log("Created Serviço!");
    return serviço;
};

module.exports = populateTest;

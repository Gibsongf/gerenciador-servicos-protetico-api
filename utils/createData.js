const { faker } = require("@faker-js/faker/locale/pt_BR");
const Dentista = require("../models/dentista");
const Serviço = require("../models/serviço");
const Local = require("../models/local");
const Produto = require("../models/produto");
const { format } = require("date-fns");

const randomNumber = (array) => {
    if (array.length === 1) {
        return 0;
    }
    const indx = Math.floor(Math.random() * array.length);
    return indx;
};
exports.createDentista = async (local_id, dentistaArray) => {
    const dentista = new Dentista({
        nome: faker.person.firstName(),
        sobrenome: faker.person.lastName(),
        local: local_id,
        telefone: String(faker.phone.number("#############")),
        cpf: String(faker.phone.number("###########")),
    });
    await dentista.save();
    dentistaArray.push(dentista);

    return dentista;
};

exports.createLocal = async () => {
    const opt = ["Normal", "Reduzido"];
    const type = opt[randomNumber(opt)];
    const local = new Local({
        nome: faker.company.name(),
        endereço: faker.location.streetAddress(),
        tabela: type,
        cep: faker.location.zipCode(),
        telefone: String(faker.phone.number("#############")),
    });
    await local.save();
    return local;
};
exports.createProduto = async (produtoArray) => {
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
exports.createServiço = async (dentistaArray, produtoArray, date) => {
    const dentista = dentistaArray[randomNumber(dentistaArray)];
    const produto = produtoArray[randomNumber(produtoArray)];
    const produto2 = produtoArray[randomNumber(produtoArray)];
    const formattedDate = format(new Date(date), "yyyy-MM-dd");
    // console.log(formattedDate);
    const serviço = new Serviço({
        dentista: dentista._id,
        paciente: faker.person.fullName(),
        produto: [produto._id, produto2._id],
        local: dentista.local._id,
        statusEntrega: false,
        dataRegistro: formattedDate,
    });
    await serviço.save();
    console.log(serviço);
    //console.log("Created Serviço!");
    return serviço;
};
exports.createServiçoTest = async (dentista, produto) => {
    const serviço = new Serviço({
        dentista: dentista._id,
        paciente: faker.person.fullName(),
        produto: [produto._id],
        local: dentista.local._id,
        statusEntrega: false,
    });
    await serviço.save();
    //console.log("Created Serviço!");
    return serviço;
};

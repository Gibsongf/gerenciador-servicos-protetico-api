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
    // console.log(serviço);
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

const realProductsReduzido = {
    "AEB (SPLINT)": [105, 95],
    "ARCO LINGUAL/BARRA PALATINA": [80, 80],
    "BARRA BOTÃO": [95, 87],
    "BOTÃO DE NANCE": [95, 87],
    "BIMLER A": [255, 255],
    "BIMLER B/C": [280, 280],
    "BIONATOR BÁSICO/INVERTIDO/PROTETOR": [195, 195],
    "CONTENÇÃO ACETATO(1 MM)": [85, 65],
    "CONTENÇÃO CONTÍNUA (BEGG)": [104, 80],
    "CONTENÇÃO FIXA (HIGIÊNICA/RETA)": [45, 40],
    "CONTENÇÃO HAWLEY": [80, 65],
    // "CARACTERIZAÇÃO (NOME, ADESIVO, BRILHO)": "A PARTIR DE 20",
    "COBERTURA OCLUSAL": [10, 10],
    "DISJUNTOR HYRAX/HAAS": [115, 100],
    "DISJUNTOR HYRAX/HAAS COM GANCHO": [125, 115],
    "DISJUNTOR MACNAMRA": [125, 115],
    "DUPLICAÇÃO DE MODELO": [25, 20],
    "EXPANSOR UNIVERSAL": [100, 90],
    GRADE: [25, 20],
    "GRADE FIXA SOLDADA BANDA": [85, 80],
    KLAMT: [220, 220],
    "MANTEDOR ESTÉTICO(1 DENTE)": [115, 90],
    "MANTEDOR ESTÉTICO DENARI": [140, 140],
    MOLA: [10, 10],
    "MONTAGEM ARTICULADOR": [25, 10],
    "PÊNDULO /PENDEX": [155, 155],
    "PLACA RONCO E APNÉIA PLG": [455, 455],
    "PLACA SILICONE (CLAREAMENTO)": [45, 45],
    "PLACA SIMPLES": [220, 220],
    "PLACA COMPOSTO": [240, 240],
    "PLATÔ SOLDADO BANDA": [85, 80],
    PLATÔ: [80, 75],
    "PLACA BRUXISMO ACRÍLICA": [125, 100],
    "SN1/2/3": [220, 220],
    "SN4/5": [250, 250],
    "REGULADOR DE FRANKELL": [280, 280],
    "VAZAR GESSO": [25, 25],
    "EXPANSOR BILATERAL": [22, 22],
    "EXPANSOR UNILATERAL": [30, 30],
    "EXPANSOR HYRAX": [45, 45],
    EQUIPLAN: [20, 20],
    "ESCUDO BIMLER": [20, 20],
};

exports.storeRealProducts = async (produtoArray) => {
    const nomes = Object.keys(realProductsReduzido);
    nomes.forEach(async (n) => {
        const valorNormal = realProductsReduzido[n][0];
        const valorReduzido = realProductsReduzido[n][1];

        const produto = new Produto({
            nome: n,
            valor_normal: valorNormal,
            valor_reduzido: valorReduzido,
        });
        produtoArray.push(produto);
        // console.log(produtoArray);
        await produto.save();
    });
};

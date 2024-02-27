const {
    createDentista,
    createLocal,
    createProduto,
    createServiçoTest,
} = require("../utils/createData");

async function populateTest() {
    const dentistaArray = [];
    const produtoArray = [];
    const local = await createLocal();
    const dentista = await createDentista(local._id, dentistaArray);
    const produto = await createProduto(produtoArray);
    const serviço = await createServiçoTest(dentista, produto);
    return { local, dentista, produto, serviço };
}

module.exports = populateTest;

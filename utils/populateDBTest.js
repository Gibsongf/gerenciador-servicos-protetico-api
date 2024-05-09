const {
    createCliente,
    createLocal,
    createProduto,
    createServiçoTest,
} = require("../utils/createData");

async function populateTest() {
    const clienteArray = [];
    const produtoArray = [];
    const local = await createLocal();
    const cliente = await createCliente(local._id, clienteArray);
    const produto = await createProduto(produtoArray);
    const serviço = await createServiçoTest(cliente, produto);
    return { local, cliente, produto, serviço };
}

module.exports = populateTest;

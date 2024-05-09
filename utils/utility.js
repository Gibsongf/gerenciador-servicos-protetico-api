// const mongoose = require("mongoose");
// mongoose.set("strictQuery", false);

// to remove new ObjectId from a mongodb object
// const { ObjectId } = require("mongodb");
// const objectIdString = new ObjectId().toHexString(data.cliente._id);
// exports.fullName = (cliente) => {
//     // To avoid errors in cases where an author does not have either a family name or first name
//     // We want to make sure we handle the exception by returning an empty string for that case
//     let fullName = "";
//     if (cliente.nome && cliente.sobrenome) {
//         fullName = `${cliente.nome} ${cliente.sobrenome}`;
//     }
//     if (!cliente.nome || !cliente.sobrenome) {
//         fullName = "";
//     }
//     return fullName;
// };
exports.emptyFields = (obj, underline) => {
    const newObj = {};
    const keys = Object.keys(obj);
    keys.forEach((k) => {
        if (obj[k]) {
            newObj[k] = obj[k];
        }
    });
    return newObj;
};
exports.formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const options = {
        year: "numeric",
        month: "long",
    };
    const format_date = date.toLocaleString("pt-BR", options);
    return format_date;
};

exports.reverseNestedService = (data, serviços, tabela) => {
    let index = serviços.length - 1;
    let newPaciente = true;
    let valueType = tabela === "Normal" ? "valor_reduzido" : "valor_normal";
    while (true) {
        let { produto, paciente } = serviços[index];
        if (produto.length) {
            let lastItem = serviços[index].produto.pop();
            // here we use the key for the right value type
            const column = {
                col1: "",
                col2: lastItem.nome,
                col3: "R$" + lastItem[valueType],
            };
            //new paciente we save in first col
            if (newPaciente) {
                column.col1 = paciente;
                newPaciente = false;
            }
            data.push(column);
        } else {
            //jump one line when previous service is finished
            const emptyLine = { col1: "", col2: "", col3: "" };
            data.push(emptyLine);
            index--;
            //move to next service and new paciente reset bool
            newPaciente = true;
        }
        if (index < 0) break;
    }
    return;
};

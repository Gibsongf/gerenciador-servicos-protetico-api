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

exports.dentistNestedService = (data, serviços, tabela) => {
    let index = serviços.length - 1;
    let newPaciente = true;
    let valueType = tabela === "Normal" ? "valor_reduzido" : "valor_normal";
    let rows = 0;
    let total = 0;
    while (true) {
        let { produto, paciente } = serviços[index];
        rows++;

        if (produto.length) {
            let lastItem = serviços[index].produto.pop();
            // here we use the key for the right value type
            const column = {
                col1: "",
                col2: lastItem.nome,
                col3: lastItem[valueType],
            };
            total += Number(lastItem[valueType]);

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
    data.push({
        col1: "",
        col2: "",
        col3: "Total",
        col4: total,
    });
    rows++;
    return rows;
};

// could do both nested service in one but will keep like this
exports.localNestedService = (data, serviços, tabela) => {
    let index = serviços.length - 1;
    let newPaciente = true;
    let valueType = tabela === "Normal" ? "valor_reduzido" : "valor_normal";
    let rows = 0;
    let total = 0;
    while (true) {
        let { produto, paciente, cliente } = serviços[index];
        rows++;

        if (produto.length) {
            let lastItem = serviços[index].produto.pop();
            // here we use the key for the right value type
            const column = {
                col1: "",
                col2: "",
                col3: lastItem.nome,
                col4: lastItem[valueType],
            };
            total += Number(lastItem[valueType]);
            //new paciente we save in first col
            if (newPaciente) {
                column.col1 = paciente;
                column.col2 = cliente.nome; //doutor
                newPaciente = false;
            }
            data.push(column);
        } else {
            //jump one line when previous service is finished
            const emptyLine = { col1: "", col2: "", col3: "", col4: "" };
            data.push(emptyLine);
            index--;
            //move to next service and new paciente reset bool
            newPaciente = true;
        }
        if (index < 0) break;
    }
    data.push({
        col1: "",
        col2: "",
        col3: "Total",
        col4: total,
    });
    rows++; //total value, line count
    return rows;
};

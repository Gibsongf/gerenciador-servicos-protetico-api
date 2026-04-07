exports.errorMsg = (err) => {
  const errors = [];
  err.errors.forEach((e) => {
    errors.push(`${e.path}: ${e.msg}`);
  });

  return errors.join(", ");
};
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
  tabela = tabela.toLowerCase();
  let index = serviços.length - 1;
  let newPaciente = true;
  const valueTypeObj = { reduzido: "valor_reduzido", normal: "valor_normal" };
  const valueType = valueTypeObj[tabela];
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
    col2: "Total",
    col3: total,
  });
  rows++;
  return rows;
};

// could do both nested service in one but will keep like this
exports.localNestedService = (data, serviços, tabela) => {
  tabela = tabela.toLowerCase();
  let index = serviços.length - 1;
  let newPaciente = true;
  const valueTypeObj = { reduzido: "valor_reduzido", normal: "valor_normal" };
  const valueType = valueTypeObj[tabela];
  let rows = 0;
  let total = 0;
  while (true) {
    let { produtos, paciente, cliente } = serviços[index];
    rows++;

    if (produtos.length) {
      let lastItem = serviços[index].produtos.pop();
      const totalProduto =
        Number(lastItem.produto[valueType]) * Number(lastItem.quantidade);
      // here we use the key for the right value type
      const column = {
        col1: "",
        col2: "",
        col3: lastItem.produto.nome + ` (x${lastItem.quantidade})`,
        col4: lastItem.produto[valueType].toFixed(2),
        col5: totalProduto.toFixed(2),
      };
      total += totalProduto;
      //new paciente we save in first col
      if (newPaciente) {
        column.col1 = paciente;
        column.col2 = cliente.nome; //doutor
        column.col6 = serviços[index].dataRegistro;
        newPaciente = false;
      }
      data.push(column);
    } else {
      //jump one line when previous service is finished
      const emptyLine = {
        col1: "",
        col2: "",
        col3: "",
        col4: "",
        col5: "",
        col6: "",
      };
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
    col4: "Total",
    col5: total.toFixed(2),
  });
  rows++; //total value, line count
  return rows;
};

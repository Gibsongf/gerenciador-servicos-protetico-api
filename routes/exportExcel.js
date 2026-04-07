const express = require("express");
const ExcelJS = require("exceljs");
const Serviço = require("../models/serviço");
const Cliente = require("../models/cliente");
const User = require("../models/user");

const router = express.Router();
const utils = require("../utils/utility");
const Local = require("../models/local");

const preHeaders = (cliente, user, local) => {
  return [
    {
      header: [
        user.labName && user.labName,
        "",
        `CROTPD ${user.crotpd}`,
        "",
        user.fullName ? `Tec. Resp.: ${user.fullName}` : "",
        "",
        user.telefone ? `Tel: ${user.telefone} (whatsapp)` : "",
        user.instagram ? `Instagram: ${user.instagram}` : "",
        "",
        "Informações do Pedido",
        "",
        // `Clinica: ${local.nome}`,
        `${cliente.nome}`,
        " ",
      ],
      key: "col1",
      width: 30,
    },

    { key: "col2", width: 30 },
    { key: "col3", width: 15 },
  ];
};
const mergeC = (worksheet) => {
  // merge header cell one by if use A1:C6 the only header available will be the first one
  Array.from(Array(13).keys()).forEach((n) => {
    const location = `A${n + 1}:D${n + 1}`;
    worksheet.mergeCells(location);
    // use cell to apply style or something else
    const cell = worksheet.getCell(location);
    cell.alignment = {
      horizontal: "center",
      vertical: "middle",
    };
  });
};
const applyCellAlignment = (rows, worksheet) => {
  Array.from(Array(rows).keys()).forEach((n) => {
    // use cell to apply style or something else
    const cell = worksheet.getRow(n + 16);
    cell.alignment = {
      horizontal: "left",
      vertical: "middle",
    };
  });
};
router.get("/", async (req, res) => {
  const { cliente, local, startDate, endDate } = req.query;

  const [[clienteData], serviçosData, userData] = await Promise.all([
    Cliente.find({ _id: cliente, user: req.user.id }).populate("local").exec(),
    Serviço.find({
      local: local,
      user: req.user.id,
      cliente: cliente,
      dataRegistro: { $gte: new Date(startDate), $lte: new Date(endDate) },
    })
      .populate({
        path: "cliente",
        select: "nome -_id", //just the "cliente" name
      })
      .populate("produtos.produto")
      .exec(),
    User.findById(req.user.id).exec(),
  ]);

  // res.send({ clienteData, serviçosData, userData }).status(200);
  if (!serviçosData.length) {
    res.status(404).json({ error: "Nenhum serviço encontrado" });
  } else {
    try {
      const data = [
        {
          col1: "Cliente",
          col2: "Doutor",
          col3: "Descrição",
          col4: "Valor Unidade",
          col5: "Valor Total",
          col6: "Data de Registro",
        },
        { col1: "", col2: "", col3: "", col4: "", col5: "", col6: "" },
        // Add your data from the database here
      ];
      // Create a new Excel workbook
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Sheet 1");
      // merge header cells  A1:C6
      let columns = preHeaders(clienteData, userData, clienteData.local);
      //replace 3 column to one for "Doutor" and set it width
      columns[2].width = 40;
      //add a 4 column for 'valor'
      columns.push({ key: "col4", width: 15 });
      columns.push({ key: "col5", width: 15 });
      columns.push({ key: "col6", width: 15 });

      // worksheet.columns = columns;
      const rows = utils.localNestedService(
        data,
        serviçosData,
        clienteData.local.tabela,
      );
      worksheet.columns = columns;
      worksheet.addRows(data);

      //apply alignment to each line pos header
      applyCellAlignment(rows, worksheet);
      mergeC(worksheet);
      // Set response headers to indicate a downloadable Excel file
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );

      // Send the Excel file as a buffer to the client
      const buffer = await workbook.xlsx.writeBuffer();
      res.send(buffer);
    } catch (error) {
      res.status(500).send(error);
    }
  }
});
router.get("/:id/mes/:inicial/:final", async (req, res) => {
  const { id, inicial, final } = req.params;
  //setting for one cliente and his services in a date range
  const [cliente, serviços] = await Promise.all([
    Cliente.findById(id).populate("local").exec(),
    Serviço.find({
      cliente: id,
      dataRegistro: { $gte: new Date(inicial), $lte: new Date(final) },
    })
      .populate("produto")
      .exec(),
  ]);
  const { local } = cliente;
  res.status(200);
  // if (!serviços.length) {
  //   res.status(404).json({ error: "Nenhum serviço encontrado" });
  // } else {
  //   try {
  //     const data = [
  //       { col1: "Paciente", col2: "Descrição", col3: "Valor" },
  //       { col1: "", col2: "", col3: "" },
  //       // Add your data from the database here
  //     ];
  //     // Create a new Excel workbook
  //     const workbook = new ExcelJS.Workbook();

  //     const worksheet = workbook.addWorksheet("Sheet 1");

  //     worksheet.columns = preHeaders(cliente);
  //     const rows = utils.dentistNestedService(data, serviços, local.tabela);
  //     worksheet.addRows(data);
  //     //apply alignment to each line pos header
  //     applyCellAlignment(rows, worksheet);
  //     // merge header cell one by if use A1:C6 the only header available will be the first one
  //     mergeC(worksheet);

  //     // Set response headers to indicate a downloadable Excel file
  //     res.setHeader(
  //       "Content-Type",
  //       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //     );
  //     // Send the Excel file as a buffer to the client
  //     const buffer = await workbook.xlsx.writeBuffer();
  //     res.send(buffer);
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).send("Internal Server Error");
  //   }
  // }
});
module.exports = router;

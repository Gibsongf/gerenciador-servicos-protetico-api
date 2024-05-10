const express = require("express");
const ExcelJS = require("exceljs");
const Serviço = require("../models/serviço");
const Cliente = require("../models/cliente");
const router = express.Router();
const utils = require("../utils/utility");
const Local = require("../models/local");

const preHeaders = (cliente) => {
    return [
        {
            header: [
                "DG Laboratório",
                "",
                "CROTPD 11054",
                "",
                "Tec. Resp.: Diana Gomes Silva",
                "",
                "Tel: (11) 96970-5611 (whatsapp)",
                "Instagram: @dglaboratório",
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
router.get("/todos/:id/mes/:inicial/:final", async (req, res) => {
    const { id, inicial, final } = req.params;

    const [local, serviços] = await Promise.all([
        Local.findById(id).exec(),
        Serviço.find({
            local: id,
            dataRegistro: { $gte: new Date(inicial), $lte: new Date(final) },
        })
            .populate({
                path: "cliente",
                select: "nome -_id", //just the "cliente" name
            })
            .populate("produto")
            .exec(),
    ]);
    if (!serviços.length) {
        res.status(404).json({ error: "Nenhum serviço encontrado" });
    } else {
        try {
            const data = [
                {
                    col1: "Cliente",
                    col2: "Doutor",
                    col3: "Descrição",
                    col4: "Valor",
                },
                { col1: "", col2: "", col3: "", col4: "" },
                // Add your data from the database here
            ];
            // Create a new Excel workbook
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Sheet 1");
            // merge header cells  A1:C6
            let columns = preHeaders(local);
            //replace 3 column to one for "Doutor" and set it width
            columns[2].width = 30;
            //add a 4 column for 'valor'
            columns.push({ key: "col4", width: 15 });
            // worksheet.columns = columns;
            const rows = utils.localNestedService(data, serviços, local.tabela);
            worksheet.columns = columns;
            worksheet.addRows(data);

            //apply alignment to each line pos header
            applyCellAlignment(rows, worksheet);
            mergeC(worksheet);
            // Set response headers to indicate a downloadable Excel file
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );

            // Send the Excel file as a buffer to the client
            const buffer = await workbook.xlsx.writeBuffer();
            res.send(buffer);
        } catch (error) {
            console.error(error);
            res.status(500).send(error);
        }
    }
});
router.get("/:id/mes/:inicial/:final", async (req, res) => {
    // console.log(req.params);
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
    if (!serviços.length) {
        res.status(404).json({ error: "Nenhum serviço encontrado" });
    } else {
        try {
            const data = [
                { col1: "Paciente", col2: "Descrição", col3: "Valor" },
                { col1: "", col2: "", col3: "" },
                // Add your data from the database here
            ];
            // Create a new Excel workbook
            const workbook = new ExcelJS.Workbook();

            const worksheet = workbook.addWorksheet("Sheet 1");

            worksheet.columns = preHeaders(cliente);
            const rows = utils.dentistNestedService(
                data,
                serviços,
                local.tabela
            );

            worksheet.addRows(data);
            //apply alignment to each line pos header
            applyCellAlignment(rows, worksheet);
            // merge header cell one by if use A1:C6 the only header available will be the first one
            mergeC(worksheet);

            // Set response headers to indicate a downloadable Excel file
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            // Send the Excel file as a buffer to the client
            const buffer = await workbook.xlsx.writeBuffer();
            res.send(buffer);
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    }
});
module.exports = router;

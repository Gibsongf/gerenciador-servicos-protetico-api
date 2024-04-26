const express = require("express");
const ExcelJS = require("exceljs");
const Serviço = require("../models/serviço");
const Dentista = require("../models/dentista");
const router = express.Router();
const utils = require("../utils/utility");

const col = (local, dentista) => {
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
                `${local.nome}, Dr.${utils.fullName(dentista)}`,
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
    Array.from(Array(12).keys()).forEach((n) => {
        const location = `A${n + 1}:C${n + 1}`;
        worksheet.mergeCells(location);
        // use cell to apply style or something else
        const cell = worksheet.getCell(location);
        cell.alignment = {
            horizontal: "center",
            vertical: "middle",
        };
    });
};
const valorType = (produto, local) => {
    if (local.tabela === "Reduzido") {
        return `R$ ${produto.valor_reduzido}`;
    }
    if (local.tabela === "Normal") {
        return `R$ ${produto.valor_normal}`;
    }
};
router.get("/:id", async (req, res) => {
    try {
        const serviço = await Serviço.findById(req.params.id)
            .populate("dentista")
            .populate("produto")
            .populate("local")
            .exec();
        const { produto, dentista, local } = serviço;

        const data = [
            { col1: "Cliente", col2: "Produto", col3: "Valor" },
            { col1: "", col2: "", col3: "" },
            // Add your data from the database here
        ];
        // Create a new Excel workbook
        const workbook = new ExcelJS.Workbook();

        const worksheet = workbook.addWorksheet("Sheet 1");
        // merge header cells  A1:C6
        mergeC(worksheet);

        worksheet.columns = col(local, dentista);

        produto.forEach((p, index) => {
            if (index === 0) {
                data.push({
                    col1: serviço.paciente,
                    col2: p.nome,
                    col3: valorType(p, local),
                });
            } else {
                data.push({ col2: p.nome, col3: valorType(p, local) });
            }
        });

        worksheet.addRows(data);

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
});
router.get("/:id/mes/:inicial/:final", async (req, res) => {
    // console.log(req.params);

    // dataRegistro: {
    //     $gt: new Date(inicial),
    //     $lt: new Date(final)
    // }
    const { id, inicial, final } = req.params;
    //setting for one dentist and his services in a date range
    const [dentista, serviços] = await Promise.all([
        Dentista.findById(id).populate("local").exec(),
        Serviço.find({
            dentista: id,
            dataRegistro: { $gt: new Date(inicial), $lt: new Date(final) },
        })
            .populate("produto")
            .exec(),
    ]);
    const { local } = dentista;
    try {
        const data = [
            { col1: "Cliente", col2: "Produto", col3: "Valor" },
            { col1: "", col2: "", col3: "" },
            // Add your data from the database here
        ];
        // Create a new Excel workbook
        const workbook = new ExcelJS.Workbook();

        const worksheet = workbook.addWorksheet("Sheet 1");
        mergeC(worksheet);

        worksheet.columns = col(local, dentista);

        //we can create a obj {col1 col2 col3} for each service and then pass it to data
        // merge header cell one by if use A1:C6 the only header available will be the first one
        // const serviceCol = {};
        serviços.forEach((serviço) => {
            const { produto, paciente } = serviço;
            // serviceCol[paciente] = produto;
            produto.forEach((p, index) => {
                //first iteration register paciente with produto and value
                if (index === 0) {
                    data.push({
                        col1: serviço.paciente,
                        col2: p.nome,
                        col3: valorType(p, local),
                    });
                } else {
                    //just the product and its value
                    data.push({ col2: p.nome, col3: valorType(p, local) });
                }
            });
            data.push({ col1: "", col2: "", col3: "" });
        });
        worksheet.addRows(data);
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
});
module.exports = router;

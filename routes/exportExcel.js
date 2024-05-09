const express = require("express");
const ExcelJS = require("exceljs");
const Serviço = require("../models/serviço");
const Cliente = require("../models/cliente");
const router = express.Router();
const utils = require("../utils/utility");

const col = (local, cliente) => {
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
            .populate("cliente")
            .populate("produto")
            .populate("local")
            .exec();
        const { produto, cliente, local } = serviço;

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

        worksheet.columns = col(local, cliente);

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
            mergeC(worksheet);

            worksheet.columns = col(local, cliente);

            //we can create a obj {col1 col2 col3} for each service and then pass it to data
            // merge header cell one by if use A1:C6 the only header available will be the first one
            utils.reverseNestedService(data, serviços, local.tabela);
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
    }
});
module.exports = router;

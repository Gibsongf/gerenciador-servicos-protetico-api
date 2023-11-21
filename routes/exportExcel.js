const express = require("express");
const ExcelJS = require("exceljs");
const Serviço = require("../models/serviço");
const Local = require("../models/local");
const router = express.Router();
const utils = require("../utils/utility");
router.get("/:id", async (req, res) => {
    try {
        const serviço = await Serviço.findById(req.params.id)
            .populate("dentista")
            .populate("produto")
            .exec();
        const local = await Local.findById(serviço.dentista.local).exec();
        const { produto, dentista } = serviço;

        // Create a new Excel workbook
        const workbook = new ExcelJS.Workbook();
        const valorType = (p) => {
            if (local.tabela === "Reduzido") {
                return p.valor_reduzido;
            }
            if (local.tabela === "Normal") {
                return p.valor_normal;
            }
        };

        const worksheet = workbook.addWorksheet("Sheet 1");

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

        worksheet.columns = [
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
                ],
                key: "col1",
                width: 15,
            },
            { key: "col2", width: 30 },
            { key: "col3", width: 15 },
        ];
        const data = [
            { col1: "Cliente", col2: "Produto", col3: "Valor" },

            // Add your data from the database here
        ];

        produto.forEach((p, index) => {
            if (index === 0) {
                data.push({
                    col1: serviço.paciente,
                    col2: p.nome,
                    col3: valorType(p),
                });
            } else {
                data.push({ col2: p.nome, col3: valorType(p) });
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

module.exports = router;

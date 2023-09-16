const express = require("express");
const ExcelJS = require("exceljs");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        // Create a new Excel workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Sheet 1");

        // Add data to the worksheet
        worksheet.columns = [
            { header: "Column 1", key: "col1", width: 15 },
            { header: "Column 2", key: "col2", width: 15 },
        ];

        const data = [
            { col1: "Value 1", col2: "Value 2" },
            // Add your data from the database here
        ];

        worksheet.addRows(data);

        // Set response headers to indicate a downloadable Excel file
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=exported_data.xlsx"
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

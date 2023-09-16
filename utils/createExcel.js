const XLSX = require("xlsx");
const Excel = require("exceljs");

// import path from "path";
// const jsonData = [
//     { name: "Diary", code: "diary_code", author: "Pagorn" },
//     { name: "Note", code: "note_code", author: "Pagorn" },
//     { name: "Medium", code: "medium_code", author: "Pagorn" },
// ];
// const workSheet = XLSX.utils.json_to_sheet(jsonData);
// const workBook = XLSX.utils.book_new();
// XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet 1");
// XLSX.writeFile(workBook, __dirname + "/sample.xlsx");

const countries = [
    {
        name: "Cameroon",
        capital: "Yaounde",
        countryCode: "CM",
        phoneIndicator: 237,
    },
    { name: "France", capital: "Paris", countryCode: "FR", phoneIndicator: 33 },
    {
        name: "United States",
        capital: "Washington, D.C.",
        countryCode: "US",
        phoneIndicator: 1,
    },
    {
        name: "India",
        capital: "New Delhi",
        countryCode: "IN",
        phoneIndicator: 91,
    },
    {
        name: "Brazil",
        capital: "Brasília",
        countryCode: "BR",
        phoneIndicator: 55,
    },
    { name: "Japan", capital: "Tokyo", countryCode: "JP", phoneIndicator: 81 },
    {
        name: "Australia",
        capital: "Canberra",
        countryCode: "AUS",
        phoneIndicator: 61,
    },
    {
        name: "Nigeria",
        capital: "Abuja",
        countryCode: "NG",
        phoneIndicator: 234,
    },
    {
        name: "Germany",
        capital: "Berlin",
        countryCode: "DE",
        phoneIndicator: 49,
    },
];

const exportCountriesFile = async () => {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet("Countries List");

    // to include in the same order of the columns
    worksheet.columns = [
        { key: "name", header: "Name" },
        { key: "countryCode", header: "Country Code" },
        { key: "capital", header: "Capital" },
        { key: "phoneIndicator", header: "International Direct Dialling" },
    ];

    //content an object that copy the columns order
    // {
    //     name: "Germany",
    //     capital: "Berlin",
    //     countryCode: "DE",
    //     phoneIndicator: 49,
    // },
    countries.forEach((item) => {
        worksheet.addRow(item);
    });
    // Style don't show at vs code but are applied
    worksheet.columns.forEach((sheetColumn) => {
        sheetColumn.font = {
            size: 12,
        };
        sheetColumn.width = 30;
    });

    worksheet.getRow(1).font = {
        bold: true,
        size: 13,
    };
    // const exportPath = path.resolve(__dirname, "countries.xlsx");

    await workbook.xlsx.writeFile("sample2.xlsx");
};

exportCountriesFile();

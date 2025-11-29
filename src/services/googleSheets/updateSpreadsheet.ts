import { sheets_v4 } from "googleapis";
import Sheets = sheets_v4.Sheets;

const TABLE_HEADERS = [
    "id",
    "date",
    "geo_name",
    "warehouse_name",
    "delivery_base",
    "delivery_coef_expr",
    "delivery_liter",
    "delivery_marketplace_base",
    "delivery_marketplace_coef_expr",
    "delivery_marketplace_liter",
    "storage_base",
    "storage_coef_expr",
    "storage_liter",
];

const tableMapper = ({
    id,
    date,
    geo_name,
    warehouse_name,
    delivery_base,
    delivery_coef_expr,
    delivery_liter,
    delivery_marketplace_base,
    delivery_marketplace_coef_expr,
    delivery_marketplace_liter,
    storage_base,
    storage_coef_expr,
    storage_liter,
}: any): string[] => {
    return [
        id,
        date,
        geo_name,
        warehouse_name,
        delivery_base,
        delivery_coef_expr,
        delivery_liter,
        delivery_marketplace_base,
        delivery_marketplace_coef_expr,
        delivery_marketplace_liter,
        storage_base,
        storage_coef_expr,
        storage_liter,
    ];
};

export async function updateSpreadsheet(
    sheets: Sheets,
    { spreadsheet_id: spreadsheetId }: { spreadsheet_id: string },
    newName: string,
    data: Record<string, any>[],
) {
    const values = [TABLE_HEADERS, ...data.map(tableMapper)];

    await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: "stocks_coefs!A1",
        valueInputOption: "RAW",
        requestBody: { values },
    });

    console.log(`✔ Sheets [${spreadsheetId}] updates`);
}

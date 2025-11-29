import { getSheetsClient } from "./googleClient.js";
import { updateSpreadsheet} from "./updateSpreadsheet.js";
import knex from "#postgres/knex.js";

function getDataBaseData(sortingRow: string) {
    return knex('box as b')
        .select(
            'b.id',
            'b.date',
            'b.delivery_base',
            'b.delivery_coef_expr',
            'b.delivery_liter',
            'b.delivery_marketplace_base',
            'b.delivery_marketplace_coef_expr',
            'b.delivery_marketplace_liter',
            'b.storage_base',
            'b.storage_coef_expr',
            'b.storage_liter',
            'b.created_at',
            'b.updated_at',
            'b.deleted_at',

            knex.ref('w.name').as('warehouse_name'),
            knex.ref('g.name').as('geo_name')
        )
        .join('warehouses as w', 'b.warehouse_id', '=', 'w.id')
        .join('geo as g', 'w.geo_id', '=', 'g.id')
        .orderBy(`b.${sortingRow}`, 'asc');
}

const byDeliverySortedName = 'delivery_coef_expr';
const byMarketplaceSortedName = 'delivery_marketplace_coef_expr';
const byStorageSortedName = 'storage_coef_expr';

export async function pushAll() {
    console.log("Starting Google Sheets sync...");

    const [sheets, spreadsheetIds] = await Promise.all([
        getSheetsClient(),
        knex('spreadsheets')
            .select('spreadsheet_id')
            .limit(3)
    ]);

    const [byDeliverySorted, byMarketplaceSorted, byStorageSorted] = await Promise.all([
        getDataBaseData(byDeliverySortedName),
        getDataBaseData(byMarketplaceSortedName),
        getDataBaseData(byStorageSortedName),
    ]);

    await Promise.all([
        updateSpreadsheet(sheets, spreadsheetIds.at(0)!, byDeliverySortedName, byDeliverySorted),
        updateSpreadsheet(sheets, spreadsheetIds.at(1)!, byMarketplaceSortedName, byMarketplaceSorted),
        updateSpreadsheet(sheets, spreadsheetIds.at(2)!, byStorageSortedName, byStorageSorted),
    ]);

    console.log("✔ All sheets updated");
}

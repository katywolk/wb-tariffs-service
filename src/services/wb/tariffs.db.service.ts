import {Knex} from "knex"
import knex from "#postgres/knex.js";
import { parseWbNumber } from "./wbParser.js";

/**
 * Оптимизированная функция для сохранения тарифов WB в БД.
 * Использует транзакцию и пакетные операции для минимизации запросов.
 */
export async function saveWbTariffsToDb(data: {date: string; warehouseList: any[] }) {

    const warehouses = data.warehouseList;
    const date = data.date;

    if (!warehouses || warehouses.length === 0) {
        console.log("WB tariffs: Warehouse list is empty, nothing to save.");
        return;
    }

    const now = knex.fn.now();

    const uniqueGeoNames = new Set<string>();
    const uniqueWarehouseNames = new Set<string>();

    for (const w of warehouses) {
        if (w.geoName && w.geoName.trim() !== "") {
            uniqueGeoNames.add(w.geoName.trim());
        }
        if (w.warehouseName && w.warehouseName.trim() !== "") {
            uniqueWarehouseNames.add(w.warehouseName.trim());
        }
    }

    await knex.transaction(async (trx: Knex.Transaction) => {

        const existingGeos = await trx("geo")
            .whereIn("name", Array.from(uniqueGeoNames))
            .select("id", "name");

        const existingGeoMap = new Map(
            existingGeos.map(geo => [geo.name, geo.id])
        );
        const newGeoNames = Array.from(uniqueGeoNames).filter(
            name => !existingGeoMap.has(name)
        );

        if (newGeoNames.length > 0) {
            const newGeoRecords = newGeoNames.map(name => ({ name }));
            const insertedGeos = await trx("geo")
                .insert(newGeoRecords)
                .returning(["id", "name"]);

            insertedGeos.forEach(geo => existingGeoMap.set(geo.name, geo.id));
        }


        const existingWarehouses = await trx("warehouses")
            .whereIn("name", Array.from(uniqueWarehouseNames))
            .select("id", "name");

        const existingWarehouseMap = new Map(
            existingWarehouses.map(wh => [wh.name, wh.id])
        );
        const newWarehouseRecords = [];

        for (const w of warehouses) {
            const warehouseName = w.warehouseName.trim();
            if (
                warehouseName !== "" &&
                !existingWarehouseMap.has(warehouseName)
            ) {
                let geoId: number | null = null;
                const geoName = w.geoName ? w.geoName.trim() : "";
                if (geoName !== "") {
                    geoId = existingGeoMap.get(geoName) || null;
                }

                newWarehouseRecords.push({
                    name: warehouseName,
                    geo_id: geoId,
                });
                existingWarehouseMap.set(warehouseName, -1);
            }
        }

        if (newWarehouseRecords.length > 0) {
            const insertedWarehouses = await trx("warehouses")
                .insert(newWarehouseRecords)
                .returning(["id", "name"]);

            insertedWarehouses.forEach(wh =>
                existingWarehouseMap.set(wh.name, wh.id)
            );
        }


        const pricingDataToInsert = [];
        const pricingDataToUpdate = [];

        const warehouseIds = Array.from(existingWarehouseMap.values()).filter(id => id !== -1) as number[];

        let existingPricesMap = new Map<number, number>();

        if (warehouseIds.length > 0) {
            const existingPrices = await trx("box")
                .whereIn("warehouse_id", warehouseIds)
                .andWhere("date", date)
                .select("id", "warehouse_id");

            existingPricesMap = new Map(
                existingPrices.map(price => [price.warehouse_id, price.id])
            );
        }


        for (const w of warehouses) {
            const warehouseName = w.warehouseName.trim();
            const warehouseId = existingWarehouseMap.get(warehouseName);

            if (warehouseId === undefined || warehouseId === -1) {

                continue;
            }

            const pricingData = {
                warehouse_id: warehouseId,
                date,

                delivery_base: parseWbNumber(w.boxDeliveryBase),
                delivery_coef_expr: parseWbNumber(w.boxDeliveryCoefExpr),
                delivery_liter: parseWbNumber(w.boxDeliveryLiter),

                delivery_marketplace_base: parseWbNumber(w.boxDeliveryMarketplaceBase),
                delivery_marketplace_coef_expr: parseWbNumber(w.boxDeliveryMarketplaceCoefExpr),
                delivery_marketplace_liter: parseWbNumber(w.boxDeliveryMarketplaceLiter),

                storage_base: parseWbNumber(w.boxStorageBase),
                storage_coef_expr: parseWbNumber(w.boxStorageCoefExpr),
                storage_liter: parseWbNumber(w.boxStorageLiter),

                updated_at: now
            };

            const existingBoxId = existingPricesMap.get(warehouseId);

            if (existingBoxId) {
                pricingDataToUpdate.push({ id: existingBoxId, ...pricingData });
            } else {
                pricingDataToInsert.push(pricingData);
            }
        }

        if (pricingDataToInsert.length > 0) {
            await trx("box").insert(pricingDataToInsert);
        }


        for (const updateItem of pricingDataToUpdate) {
            await trx("box")
                .where("id", updateItem.id)
                .update(updateItem);
        }


    });

    console.log("WB tariffs saved successfully (Optimized)");
}
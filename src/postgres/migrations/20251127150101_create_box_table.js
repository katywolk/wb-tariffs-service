/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
    return knex.schema.createTable("box", (table) => {
        table.increments("id").primary();

        table
            .integer("warehouse_id")
            .unsigned()
            .notNullable()
            .references("id")
            .inTable("warehouses")
            .onDelete("CASCADE");

        table.date("date").notNullable();

        table.decimal("delivery_base", 10, 3);
        table.decimal("delivery_coef_expr", 10, 3);
        table.decimal("delivery_liter", 10, 3);

        table.decimal("delivery_marketplace_base", 10, 3);
        table.decimal("delivery_marketplace_coef_expr", 10, 3);
        table.decimal("delivery_marketplace_liter", 10, 3);

        table.decimal("storage_base", 10, 3);
        table.decimal("storage_coef_expr", 10, 3);
        table.decimal("storage_liter", 10, 3);

        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
        table.timestamp("deleted_at");

        table.unique(["warehouse_id", "date"]);
        table.index(["warehouse_id"]);
        table.index(["delivery_coef_expr"]);
        table.index(["delivery_marketplace_coef_expr"]);
        table.index(["storage_coef_expr"]);
    });}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
    return knex.schema.dropTableIfExists("box");
}

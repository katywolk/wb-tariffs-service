/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
    return knex.schema.createTable("warehouses", (table) => {
        table.increments("id").primary();
        table.string("name").notNullable();

        table
            .integer("geo_id")
            .unsigned()
            .references("id")
            .inTable("geo")
            .onDelete("CASCADE");

        table.unique(["name", "geo_id"]);
    });}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
    return knex.schema.dropTableIfExists("warehouses");
}

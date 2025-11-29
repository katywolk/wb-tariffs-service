import env from "#config/env/env.js";

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function seed(knex) {
    await knex("spreadsheets")
        .insert(env.GOOGLE_SHEETS_IDS.map((id) => ({spreadsheet_id: id})))
        .onConflict(["spreadsheet_id"])
        .ignore();
}

import { fetchWbBoxTariffs } from "./tariffs.service.js";
import { saveWbTariffsToDb } from "./tariffs.db.service.js";

export async function grepData(date?: string) {
    try {
        console.log("⏳ Fetching WB tariffs...");
        const data = await fetchWbBoxTariffs(date);

        console.log("📥 Saving tariffs to DB...");
        await saveWbTariffsToDb(data);

        console.log("✅ Done! Data inserted/updated.");
    } catch (err) {
        console.error("❌ Error in runOnce:", err);
    }
}


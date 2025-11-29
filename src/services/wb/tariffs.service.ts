import env from "#config/env/env.js";

export async function fetchWbBoxTariffs(date = new Date().toISOString().split("T")[0]) {
    if (!env.WB_API_KEY) {
        console.error("❌ WB_API_KEY is missing in .env");
        process.exit(1);
    }
    console.log(`Request to WB for date [${date}]`);
    const url = `https://common-api.wildberries.ru/api/v1/tariffs/box?date=${date}`;

    const headers = new Headers();
    headers.append('Authorization', `Bearer ${env.WB_API_KEY}`)

    try {

        const res = await fetch(url, {
            headers,
        });

        if (!res.ok) {
            let body = "";
            try {
                body = await res.text();
            } catch {}

            throw new Error(`WB API error: status=${res.status}, body=${body}`);
        }

        const data = await res.json();
        return {
            ...(data?.response?.data || {}),
            date,
        };

    } catch (err) {
        console.error("Error fetching WB box tariffs:", err);
        throw err;
    }
}
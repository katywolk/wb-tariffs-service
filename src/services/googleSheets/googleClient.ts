import { google, sheets_v4 } from "googleapis";
import env from "#config/env/env.js";
import Sheets = sheets_v4.Sheets;

export async function getSheetsClient(): Promise<Sheets> {

    const auth = new google.auth.GoogleAuth({
        credentials: env.GOOGLE_PRIVATE_KEY_FILE_AS_JSON_STRING,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    return google.sheets({ version: "v4", auth });
}
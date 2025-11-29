import { z } from "zod";
import { Request, Response, Router } from "express";
import { grepData } from "#services/wb/grepData.js";
import { pushAll } from "#services/googleSheets/pushAll.js";

const CronRouter = Router();

CronRouter.get("/run", async (req: Request, res: Response) => {
    const timestamp: string = new Date().toISOString();
    const date = z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Неверный формат даты. Ожидается YYYY-MM-DD.")
        .default(timestamp.split('T')[0])
        .parse(req.query.date);
    try {
        await grepData(date);
        await pushAll();
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: "error",
            message: "INTERNAL_ERROR",
            receivedAt: timestamp,
        });
        return;
    }

    console.log(`[${date}] Request successfully.`);

    res.status(200).json({
        status: "ok",
        message: "Cron task accepted and running.",
        receivedAt: timestamp,
    });
});

export { CronRouter };

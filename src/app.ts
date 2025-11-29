import env from "#config/env/env.js";
import { migrate, seed } from "#postgres/knex.js"
import express from 'express';
import {AppRouter} from './services/api/inex.js';

await migrate.latest();
await seed.run();

const app = express();

const PORT = env.APP_PORT || 3000;

if (isNaN(PORT)) {
    console.error("Error: APP_PORT is not a valid number.");
    process.exit(1);
}

app.use(express.json());
app.use(AppRouter);

app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(` Server running on port ${PORT}`);
    console.log(` Access URL: http://localhost:${PORT}`);
    console.log(`=================================================`);
});

function processError(error: Error) {
    console.error(error);
}

process.on('unhandledRejection', processError);
process.on('uncaughtException', processError);

console.log("All migrations and seeds have been run");
import { Router } from 'express';

import {CronRouter} from './cron.js'

const ApiRouter = Router();

ApiRouter.use('/cron', CronRouter);

export {ApiRouter};
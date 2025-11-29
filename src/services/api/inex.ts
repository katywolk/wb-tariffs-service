import { Router } from 'express';

import {ApiRouter} from './routes/index.js';

const AppRouter = Router();

AppRouter.use('/api', ApiRouter);

export {AppRouter};
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import webhookRouter from './routes/webhook';

const app = express();
app.use(express.json());
app.use('/', webhookRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Frankie bot running on port ${PORT}`));
import cors from 'cors';
import express from 'express';
import { ordersRouter } from './routes/orders';

export const app = express();

app.use(cors());
app.use(express.json());

app.use('/orders', ordersRouter);
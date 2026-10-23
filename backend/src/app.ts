import cors from 'cors';
import express from 'express';
import { ordersRouter } from './routes/orders';
import { errorHandler } from './middleware/errorHandler';

export const app = express();

app.use(cors());
app.use(express.json());

app.use('/orders', ordersRouter);

app.use((_req, res) => {
  res.status(404).json({ error: { status: 404, message: 'Route not found' } });
});

app.use(errorHandler);
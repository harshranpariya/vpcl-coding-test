import { Router } from 'express';
import * as orderService from '../services/orderService';

export const ordersRouter = Router();

ordersRouter.get('/', (_req, res) => {
  res.json(orderService.listOrders());
});
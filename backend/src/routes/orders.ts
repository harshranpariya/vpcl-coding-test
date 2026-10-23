import { Router } from 'express';
import * as orderService from '../services/orderService';
import { badRequest } from '../errors';
import { isOrderStatus, ORDER_STATUSES } from '../types';
export const ordersRouter = Router();

ordersRouter.get('/', (_req, res) => {
  res.json(orderService.listOrders());
});

ordersRouter.get('/:id', (req, res) => {
  res.json(orderService.getOrder(req.params.id));
});

ordersRouter.patch('/:id', (req, res) => {
  const status: unknown = req.body?.status;
  if (!isOrderStatus(status)) {
    throw badRequest(`"status" is required and must be one of: ${ORDER_STATUSES.join(', ')}`);
  }
  res.json(orderService.updateStatus(req.params.id, status));
});

import { Router } from 'express';
import {
  createItem,
  getItems,
  updateItem,
  deleteItem
} from '../controllers/items.js';

export const itemRouter = Router();

itemRouter.post('/create', createItem);
itemRouter.get('/get', getItems);
itemRouter.put('/update/:itemCode', updateItem);
itemRouter.delete('/delete/:itemCode', deleteItem);
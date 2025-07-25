import { Router } from 'express';
import {
  createWarehouse,
  getWarehouses,
  getWarehouseByCode,
  updateWarehouse,
  deleteWarehouse,
} from '../controllers/warehouse.js';

export const warehouseRouter = Router();

warehouseRouter.post('/create', createWarehouse);           // POST /api/warehouses
warehouseRouter.get('/get', getWarehouses);              // GET /api/warehouses  
warehouseRouter.get('/get/:warehouseCode', getWarehouseByCode);  // GET /api/warehouses/:code
warehouseRouter.put('/update/:warehouseCode', updateWarehouse);     // PUT /api/warehouses/:code
warehouseRouter.delete('/delete/:warehouseCode', deleteWarehouse);  // DELETE /api/warehouses/:code
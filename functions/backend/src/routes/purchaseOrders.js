import { Router } from 'express';
import { createPurchaseOrder, deletePurchaseOrder, getAllPurchaseOrders, getPurchaseOrderByNumber, updatePurchaseOrder } from '../controllers/purchaseOrders.js';

export const PORouter = Router();

// purchase orders
PORouter.get('/get', getAllPurchaseOrders);
PORouter.get('/get/:poNumber', getPurchaseOrderByNumber);
PORouter.post('/create', createPurchaseOrder);
PORouter.put('/update/:poNumber', updatePurchaseOrder);
PORouter.delete('/delete/:poNumber', deletePurchaseOrder);



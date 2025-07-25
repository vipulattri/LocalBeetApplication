import { Router } from "express";
import { createBillOfMaterial, getAllBOMs, getBOMById } from "../controllers/BillsOfMaterials.js";

export const BOMRouter = Router();

BOMRouter.get('/get', getAllBOMs);
BOMRouter.get('/get/:bomId', getBOMById);
BOMRouter.post('/create', createBillOfMaterial);
// BOMRouter.put('/update/:bomId', updateBillOfMaterial);
// BOMRouter.delete('/delete/:bomId', deleteBillOfMaterial);
// BOMRouter.delete('/delete/:bomId/:itemCode', deleteBOMItem);


import { Router } from "express";
import { createJobOrder, deleteJobOrder, getJobOrder, updateJobOrder } from "../controllers/JobOrders.js";

export const jobRouter = Router();

jobRouter.get('/get', getJobOrder);
jobRouter.post('/create', createJobOrder);
jobRouter.put('/update/:orderNumber', updateJobOrder);
jobRouter.delete('/delete/:orderNumber', deleteJobOrder);
import { Router } from 'express';
import {
  createMetric,
  getMetrics,
  updateMetric,
  deleteMetric
} from '../controllers/metricCreator.js';
 
export const metricRouter = Router();
 
metricRouter.post('/create', createMetric);             // Create
metricRouter.get('/get', getMetrics);                // Read all
metricRouter.put('/update/:metricName', updateMetric);  // Update
metricRouter.delete('/delete/:metricName', deleteMetric); // Delete
 
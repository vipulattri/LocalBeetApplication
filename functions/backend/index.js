import express from 'express'
import {enquiryRouter} from './src/routes/Enquiries.js'
import catalyst from 'zcatalyst-sdk-node';
import cors from 'cors'
import { BOMRouter } from './src/routes/BillsOfMaterials.js';
import { itemRouter } from './src/routes/items.js';
import { PORouter } from './src/routes/purchaseOrders.js';
import { jobRouter } from './src/routes/JobOrders.js';
import { SIVRouter } from './src/routes/storeIssueVoucher.js';
import { GRNRouter } from './src/routes/goodReceiptNotes.js';
import { warehouseRouter } from './src/routes/warehouse.js';
import { metricRouter } from './src/routes/metricCreator.js';

const app = express();

app.use(cors({
  origin: '*', // or '*' to allow all origins (not recommended in prod)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(express.json());

app.use((req, res, next) => {
    req.catalystApp = catalyst.initialize(req);
    next();
});

app.get("/" , (req , res) =>{
  res.send("development server is working")
})

app.use('/api/enquiries', enquiryRouter);
app.use('/api/BOM', BOMRouter);
app.use('/api/JobOrder', jobRouter);
app.use('/api/items', itemRouter);
app.use('/api/purchaseOrders', PORouter);
app.use('/api/storeIssueVoucher', SIVRouter);
app.use('/api/goodReceiptNotes', GRNRouter);
app.use('/api/warehouse', warehouseRouter);
app.use('/api/metric', metricRouter);



export default app;
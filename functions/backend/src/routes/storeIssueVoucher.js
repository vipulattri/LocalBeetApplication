import { Router } from "express";
import { createStoreIssueVoucher, deleteSIVItem, deleteStoreIssueVoucher, getAllStoreIssueVouchers, getStoreIssueVoucher, updateStoreIssueVoucher } from "../controllers/storeIssueVoucher.js";

export const SIVRouter = Router();

SIVRouter.get('/get', getAllStoreIssueVouchers);
SIVRouter.get('/get/:voucherNumber', getStoreIssueVoucher);
SIVRouter.post('/create', createStoreIssueVoucher);
SIVRouter.put('/update/:voucherNumber', updateStoreIssueVoucher);
SIVRouter.delete('/delete/:voucherNumber', deleteStoreIssueVoucher);
SIVRouter.delete('/delete/:voucherCode/:itemCode', deleteSIVItem);

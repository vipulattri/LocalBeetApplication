import Router from 'express'
import { createGoodsReceiptNote, deleteGoodsReceiptNote, deleteGRNItem, getAllGoodsReceiptNotes, getGoodsReceiptNoteByNumber, updateGoodsReceiptNote } from '../controllers/goodReceiptNotes.js';

export const GRNRouter = Router();

GRNRouter.get('/get', getAllGoodsReceiptNotes);
GRNRouter.get('/get/:grnNumber', getGoodsReceiptNoteByNumber);
GRNRouter.post('/create', createGoodsReceiptNote);
GRNRouter.put('/update/:grnNumber', updateGoodsReceiptNote);
GRNRouter.delete('/delete/:grnNumber', deleteGoodsReceiptNote);
GRNRouter.delete('/delete/:grnNumber/:itemCode', deleteGRNItem);
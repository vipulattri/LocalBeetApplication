import { Router } from "express";
import { createEnquiry, deleteEnquiry, getEnquiry, updateEnquiry } from "../controllers/Enquiries.js";

export const enquiryRouter = Router();

enquiryRouter.get('/', getEnquiry);
enquiryRouter.post('/create', createEnquiry);
enquiryRouter.put('/update/:rowId', updateEnquiry);
enquiryRouter.delete('/delete/:rowId', deleteEnquiry);


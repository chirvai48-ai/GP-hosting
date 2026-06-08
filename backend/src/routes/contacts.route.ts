import { Router } from "express";
import {
  postCompanyInquiry,
  getCompanyInquiries,
  getCompanyInquiryById,
  patchCompanyInquiry,
  deleteCompanyInquiry,
  postCandidateInquiry,
  getCandidateInquiries,
  getCandidateInquiryById,
  getCandidateTalentPool,
  patchCandidateInquiry,
  deleteCandidateInquiry,
} from "../controllers/contactController";
import { validateCreate, validateUpdate } from "../middlewares/validate";
import {
  createCompanyInquirySchema,
  updateCompanyInquirySchema,
  createCandidateInquirySchema,
  updateCandidateInquirySchema,
} from "../schemas/contact.schema";

export const contactsRouter = Router();

// Company inquiries
contactsRouter.get("/company-inquiries", getCompanyInquiries);
contactsRouter.get("/company-inquiries/:id", getCompanyInquiryById);
contactsRouter.post(
  "/company-inquiries",
  validateCreate(createCompanyInquirySchema),
  postCompanyInquiry
);
contactsRouter.patch(
  "/company-inquiries/:id",
  validateUpdate(updateCompanyInquirySchema),
  patchCompanyInquiry
);
contactsRouter.delete("/company-inquiries/:id", deleteCompanyInquiry);

// Candidate inquiries
contactsRouter.get("/candidate-inquiries", getCandidateInquiries);
contactsRouter.get("/candidate-inquiries/talent-pool", getCandidateTalentPool);
contactsRouter.get("/candidate-inquiries/:id", getCandidateInquiryById);
contactsRouter.post(
  "/candidate-inquiries",
  validateCreate(createCandidateInquirySchema),
  postCandidateInquiry
);
contactsRouter.patch(
  "/candidate-inquiries/:id",
  validateUpdate(updateCandidateInquirySchema),
  patchCandidateInquiry
);
contactsRouter.delete("/candidate-inquiries/:id", deleteCandidateInquiry);

export default contactsRouter;

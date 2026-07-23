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
import { requireAuth } from "../middlewares/requireAuth";
import {
  createCompanyInquirySchema,
  updateCompanyInquirySchema,
  createCandidateInquirySchema,
  updateCandidateInquirySchema,
} from "../schemas/contact.schema";

export const contactsRouter = Router();

// Company inquiries
contactsRouter.post(
  "/company-inquiries",
  validateCreate(createCompanyInquirySchema),
  postCompanyInquiry
);
contactsRouter.get("/company-inquiries", requireAuth, getCompanyInquiries);
contactsRouter.get("/company-inquiries/:id", requireAuth, getCompanyInquiryById);
contactsRouter.patch(
  "/company-inquiries/:id",
  requireAuth,
  validateUpdate(updateCompanyInquirySchema),
  patchCompanyInquiry
);
contactsRouter.delete("/company-inquiries/:id", requireAuth, deleteCompanyInquiry);

// Candidate inquiries
contactsRouter.post(
  "/candidate-inquiries",
  validateCreate(createCandidateInquirySchema),
  postCandidateInquiry
);
contactsRouter.get("/candidate-inquiries", requireAuth, getCandidateInquiries);
contactsRouter.get("/candidate-inquiries/talent-pool", requireAuth, getCandidateTalentPool);
contactsRouter.get("/candidate-inquiries/:id", requireAuth, getCandidateInquiryById);
contactsRouter.patch(
  "/candidate-inquiries/:id",
  requireAuth,
  validateUpdate(updateCandidateInquirySchema),
  patchCandidateInquiry
);
contactsRouter.delete("/candidate-inquiries/:id", requireAuth, deleteCandidateInquiry);

export default contactsRouter;

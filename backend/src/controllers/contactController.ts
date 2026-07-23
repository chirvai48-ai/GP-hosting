import { Request, Response, NextFunction } from "express";
import {
  createCompanyInquiry,
  fetchCompanyInquiries,
  fetchCompanyInquiryById,
  patchCompanyInquiry as patchCompanyInquiryService,
  removeCompanyInquiry,
  createCandidateInquiry,
  fetchCandidateInquiries,
  fetchCandidateInquiryById,
  fetchCandidateTalentPool,
  patchCandidateInquiry as patchCandidateInquiryService,
  removeCandidateInquiry,
  fetchContactStats,
} from "../services/contacts.service";

// Company inquiries

export const postCompanyInquiry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const inquiry = await createCompanyInquiry(req.body);
    res
      .status(201)
      .json({ message: "Company inquiry submitted successfully", data: inquiry });
  } catch (err) {
    next(err);
  }
};

export const getCompanyInquiries = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const inquiries = await fetchCompanyInquiries();
    res
      .status(200)
      .json({ message: "Company inquiries fetched successfully", data: inquiries });
  } catch (err) {
    next(err);
  }
};

export const getCompanyInquiryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const inquiry = await fetchCompanyInquiryById(id);
    res
      .status(200)
      .json({ message: `Company inquiry ${id} fetched successfully`, data: inquiry });
  } catch (err) {
    next(err);
  }
};

export const patchCompanyInquiry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const updated = await patchCompanyInquiryService(id, req.body);
    res
      .status(200)
      .json({ message: `Company inquiry ${id} updated successfully`, data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteCompanyInquiry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const deleted = await removeCompanyInquiry(id);
    res
      .status(200)
      .json({ message: `Company inquiry ${id} deleted successfully`, data: deleted });
  } catch (err) {
    next(err);
  }
};

export const getContactStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await fetchContactStats();
    res
      .status(200)
      .json({ message: "Contact stats fetched successfully", data: stats });
  } catch (err) {
    next(err);
  }
};

// Candidate inquiries

export const postCandidateInquiry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const inquiry = await createCandidateInquiry(req.body);
    res
      .status(201)
      .json({ message: "Candidate inquiry submitted successfully", data: inquiry });
  } catch (err) {
    next(err);
  }
};

export const getCandidateInquiries = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const inquiries = await fetchCandidateInquiries();
    res
      .status(200)
      .json({ message: "Candidate inquiries fetched successfully", data: inquiries });
  } catch (err) {
    next(err);
  }
};

export const getCandidateTalentPool = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const inquiries = await fetchCandidateTalentPool();
    res
      .status(200)
      .json({ message: "Candidate talent pool fetched successfully", data: inquiries });
  } catch (err) {
    next(err);
  }
};

export const getCandidateInquiryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const inquiry = await fetchCandidateInquiryById(id);
    res
      .status(200)
      .json({ message: `Candidate inquiry ${id} fetched successfully`, data: inquiry });
  } catch (err) {
    next(err);
  }
};

export const patchCandidateInquiry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const updated = await patchCandidateInquiryService(id, req.body);
    res
      .status(200)
      .json({ message: `Candidate inquiry ${id} updated successfully`, data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteCandidateInquiry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const deleted = await removeCandidateInquiry(id);
    res
      .status(200)
      .json({ message: `Candidate inquiry ${id} deleted successfully`, data: deleted });
  } catch (err) {
    next(err);
  }
};

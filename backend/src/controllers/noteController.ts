import { Request, Response, NextFunction } from "express";
import {
  fetchNotes,
  createNote as createNoteService,
  patchNote as patchNoteService,
  removeNote,
} from "../services/note.service";

export const getNotes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const applicationId = Number(req.params.applicationId);
    const notes = await fetchNotes(applicationId);
    res.status(200).json({ message: "Notes fetched successfully", data: notes });
  } catch (err) {
    next(err);
  }
};

export const postNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const applicationId = Number(req.params.applicationId);
    const note = await createNoteService(applicationId, req.body);
    res.status(201).json({ message: "Note created successfully", data: note });
  } catch (err) {
    next(err);
  }
};

export const patchNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const note = await patchNoteService(id, req.body);
    res.status(200).json({ message: `Note with id ${id} updated successfully`, data: note });
  } catch (err) {
    next(err);
  }
};

export const deleteNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const deleted = await removeNote(id);
    res.status(200).json({ message: `Note with id ${id} deleted successfully`, data: deleted });
  } catch (err) {
    next(err);
  }
};

import { Router } from "express";
import { getNotes, postNote, patchNote, deleteNote } from "../controllers/noteController";
import { validateCreate, validateUpdate } from "../middlewares/validate";
import { createNoteSchema, updateNoteSchema } from "../schemas/note.schema";

export const noteRouter = Router();

noteRouter.get("/applications/:applicationId/notes", getNotes);
noteRouter.post(
  "/applications/:applicationId/notes",
  validateCreate(createNoteSchema),
  postNote
);
noteRouter.patch("/notes/:id", validateUpdate(updateNoteSchema), patchNote);
noteRouter.delete("/notes/:id", deleteNote);

export default noteRouter;

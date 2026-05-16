import { z } from "zod";

export const createNoteSchema = z.object({
  text: z.string().min(1),
  created_by_admin_id: z.string().min(1),
});

export const updateNoteSchema = z.object({
  text: z.string().min(1),
  last_edited_by_admin_id: z.string().min(1),
});

export type createNote = z.infer<typeof createNoteSchema>;
export type updateNote = z.infer<typeof updateNoteSchema>;

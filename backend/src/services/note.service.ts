import { prisma } from "../lib/prisma";
import type { createNote as createNoteInput, updateNote as updateNoteInput } from "../schemas/note.schema";

const NOTE_INCLUDE = {
  created_by_admin: { select: { id: true, name: true, email: true } },
  last_edited_by_admin: { select: { id: true, name: true, email: true } },
} as const;

export const fetchNotes = async (applicationId: number) => {
  return prisma.note.findMany({
    where: { application_id: applicationId },
    include: NOTE_INCLUDE,
    orderBy: { created_at: "desc" },
  });
};

export const createNote = async (applicationId: number, data: createNoteInput) => {
  const { text, created_by_admin_id } = data;
  return prisma.note.create({
    data: {
      text,
      application: { connect: { id: applicationId } },
      created_by_admin: { connect: { id: created_by_admin_id } },
      last_edited_by_admin: { connect: { id: created_by_admin_id } },
    },
    include: NOTE_INCLUDE,
  });
};

export const patchNote = async (id: number, data: updateNoteInput) => {
  const { text, last_edited_by_admin_id } = data;
  return prisma.note.update({
    where: { id },
    data: {
      text,
      last_edited_by_admin: { connect: { id: last_edited_by_admin_id } },
    },
    include: NOTE_INCLUDE,
  });
};

export const removeNote = async (id: number) => {
  return prisma.note.delete({ where: { id } });
};

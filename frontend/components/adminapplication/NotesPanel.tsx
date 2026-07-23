"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import type { Note, NotesResponse } from "@/types/table";
import { adminFetch } from "@/lib/adminFetch";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function fetchNotes(applicationId: number): Promise<NotesResponse> {
  const res = await adminFetch(`${API_URL}/api/applications/${applicationId}/notes`);
  if (!res.ok) throw new Error("Failed to load notes");
  return res.json();
}

async function postNote({
  applicationId,
  text,
  adminId,
}: {
  applicationId: number;
  text: string;
  adminId: string;
}) {
  const res = await adminFetch(`${API_URL}/api/applications/${applicationId}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, created_by_admin_id: adminId }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error?.formErrors?.[0] || "Failed to add note");
  }
  return res.json();
}

async function patchNote({
  id,
  text,
  adminId,
}: {
  id: number;
  text: string;
  adminId: string;
}) {
  const res = await adminFetch(`${API_URL}/api/notes/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, last_edited_by_admin_id: adminId }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error?.formErrors?.[0] || "Failed to update note");
  }
  return res.json();
}

async function deleteNote(id: number) {
  const res = await adminFetch(`${API_URL}/api/notes/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete note");
  return res.json();
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function NoteRow({
  note,
  adminId,
  onChanged,
}: {
  note: Note;
  adminId: string | undefined;
  onChanged: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(note.text);

  const editMutation = useMutation({
    mutationFn: patchNote,
    onSuccess: () => {
      setEditing(false);
      onChanged();
    },
    onError: (err) => alert((err as Error).message),
  });

  const removeMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => onChanged(),
    onError: (err) => alert((err as Error).message),
  });

  const edited = note.updated_at !== note.created_at;

  return (
    <div className="bg-white rounded border border-[var(--color-container-low)] p-3">
      {editing ? (
        <div className="flex flex-col gap-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="w-full text-sm bg-[var(--color-container-low)] rounded px-2 py-1.5 outline-none border border-transparent focus:border-[var(--color-primary)] font-[var(--font-body)] resize-y min-h-[60px]"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setEditing(false);
                setDraft(note.text);
              }}
              disabled={editMutation.isPending}
              className="text-xs px-2 py-1 rounded border border-[var(--color-on-surface-variant)] text-[var(--color-on-surface-variant)] font-[var(--font-label)] hover:bg-[var(--color-container-low)] flex items-center gap-1"
            >
              <X size={12} /> Cancel
            </button>
            <button
              onClick={() => {
                if (!adminId || !draft.trim()) return;
                editMutation.mutate({ id: note.id, text: draft.trim(), adminId });
              }}
              disabled={editMutation.isPending || !adminId || !draft.trim()}
              className="text-xs px-2 py-1 rounded bg-[var(--color-primary)] text-white font-[var(--font-label)] hover:opacity-90 flex items-center gap-1 disabled:opacity-40"
            >
              <Check size={12} /> {editMutation.isPending ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm text-[var(--color-on-surface)] font-[var(--font-body)] whitespace-pre-wrap mb-2">
            {note.text}
          </p>
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <p className="text-[10px] uppercase tracking-widest text-[var(--color-on-surface-variant)] font-[var(--font-label)]">
              Added by {note.created_by_admin?.name ?? "—"} · {formatDateTime(note.created_at)}
              {edited && (
                <>
                  {" · "}Edited by {note.last_edited_by_admin?.name ?? "—"} ·{" "}
                  {formatDateTime(note.updated_at)}
                </>
              )}
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setEditing(true)}
                className="p-1 rounded hover:bg-[var(--color-container-low)] text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)]"
                aria-label="Edit"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => {
                  if (confirm("Delete this note?")) removeMutation.mutate(note.id);
                }}
                disabled={removeMutation.isPending}
                className="p-1 rounded hover:bg-red-50 text-[var(--color-on-surface-variant)] hover:text-red-500"
                aria-label="Delete"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function NotesPanel({ applicationId }: { applicationId: number }) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const adminId = session?.user?.id;
  const [draft, setDraft] = useState("");

  const { data, isPending } = useQuery({
    queryKey: ["notes", applicationId],
    queryFn: () => fetchNotes(applicationId),
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["notes", applicationId] });

  const addMutation = useMutation({
    mutationFn: postNote,
    onSuccess: () => {
      setDraft("");
      invalidate();
    },
    onError: (err) => alert((err as Error).message),
  });

  const notes = data?.data ?? [];

  return (
    <section>
      <h3 className="font-[var(--font-headline)] text-base text-[var(--color-on-surface)] mb-3 pb-1 border-b border-[var(--color-container-low)]">
        Notes
      </h3>

      <div className="flex flex-col gap-2 mb-3">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={adminId ? "Add a note…" : "Sign in to add notes"}
          disabled={!adminId || addMutation.isPending}
          className="w-full text-sm bg-[var(--color-container-low)] rounded px-3 py-2 outline-none border border-transparent focus:border-[var(--color-primary)] font-[var(--font-body)] resize-y min-h-[64px] disabled:opacity-60"
        />
        <div className="flex justify-end">
          <button
            onClick={() => {
              if (!adminId || !draft.trim()) return;
              addMutation.mutate({
                applicationId,
                text: draft.trim(),
                adminId,
              });
            }}
            disabled={addMutation.isPending || !adminId || !draft.trim()}
            className="text-xs px-3 py-1.5 rounded bg-[var(--color-primary)] text-white font-[var(--font-label)] hover:opacity-90 disabled:opacity-40"
          >
            {addMutation.isPending ? "Adding…" : "Add note"}
          </button>
        </div>
      </div>

      {isPending ? (
        <p className="text-xs text-[var(--color-on-surface-variant)] font-[var(--font-label)]">
          Loading notes…
        </p>
      ) : notes.length === 0 ? (
        <p className="text-xs text-[var(--color-on-surface-variant)] font-[var(--font-label)] italic">
          No notes yet.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {notes.map((n) => (
            <NoteRow key={n.id} note={n} adminId={adminId} onChanged={invalidate} />
          ))}
        </div>
      )}
    </section>
  );
}

"use client";
import { Modal, Button, Box } from "@mui/material";
import { Plus } from "lucide-react";
import { useState, useRef } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/lib/auth-client";
import { createNewsSchema, CreateNewsForm } from "@/schemas/news.schemas";
import { ImageUpload } from "../Reusables/Reusables";
import { adminFetch } from "@/lib/adminFetch";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const inputCls =
  "w-full bg-[var(--color-container-low)] border-b border-b-[#c0cbc9] rounded-t-sm px-3 py-2 font-[var(--font-body)] text-base text-[var(--color-on-surface)] outline-none";
const labelCls =
  "text-[0.7rem] tracking-widest uppercase text-[var(--color-on-surface-variant)] font-medium";

async function postNews(data: CreateNewsForm) {
  const res = await adminFetch(`${API_URL}/api/news`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const fieldErrs = body?.error?.fieldErrors;
    const formErrs = body?.error?.formErrors;
    const firstFieldErr =
      fieldErrs && Object.entries(fieldErrs)[0]
        ? `${Object.entries(fieldErrs)[0][0]}: ${(Object.entries(fieldErrs)[0][1] as string[])?.[0]}`
        : null;
    const msg =
      firstFieldErr ||
      formErrs?.[0] ||
      body?.message ||
      `Request failed (HTTP ${res.status})`;
    throw new Error(msg);
  }
  return res.json();
}

function AddNews() {
  const [open, setOpen] = useState(false);
  const imageFileRef = useRef<File | null>(null);
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<CreateNewsForm>({
    resolver: zodResolver(createNewsSchema),
    defaultValues: {
      title: "",
      summary: "",
      body: "",
      status: "published",
      image_key: "",
      image_type: "",
    },
  });

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: postNews,
  });

  const onSubmit: SubmitHandler<CreateNewsForm> = async (data) => {
    const result = await mutateAsync({
      ...data,
      ...(session?.user?.id && { admin_id: session.user.id }),
    });
    const signedUrl = result?.data?.signed_url;
    if (signedUrl && imageFileRef.current) {
      await fetch(signedUrl, {
        method: "PUT",
        body: imageFileRef.current,
        headers: { "Content-Type": imageFileRef.current.type },
      });
    }
    queryClient.invalidateQueries({ queryKey: ["news"] });
    reset();
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        startIcon={<Plus />}
        sx={{ color: "#c9a84c", borderColor: "#c9a84c" }}
        onClick={() => setOpen(true)}
      >
        Add Article
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        container={typeof window !== "undefined" ? document.body : undefined}
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1300,
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 600,
            backgroundColor: "#f2f4f3",
            margin: 4,
            padding: 3,
            maxHeight: "90vh",
            overflow: "auto",
            borderRadius: 2,
          }}
        >
          <h2 className="text-xl font-[var(--font-headline)] text-[var(--color-on-surface)] mb-6">
            New Article
          </h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5">

              <div className="flex flex-col gap-1">
                <label className={labelCls}>Title</label>
                <input
                  className={inputCls}
                  placeholder="Article title…"
                  {...register("title")}
                />
                <p className="text-xs text-red-500 mt-0.5 min-h-[16px]">
                  {errors.title?.message}
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelCls}>Summary</label>
                <textarea
                  className={`${inputCls} resize-y min-h-[72px]`}
                  placeholder="Short description…"
                  {...register("summary")}
                />
                <p className="text-xs text-red-500 mt-0.5 min-h-[16px]">
                  {errors.summary?.message}
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelCls}>Body</label>
                <textarea
                  className={`${inputCls} resize-y min-h-[160px]`}
                  placeholder="Full article content…"
                  {...register("body")}
                />
                <p className="text-xs text-red-500 mt-0.5 min-h-[16px]">
                  {errors.body?.message}
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelCls}>Status</label>
                <select className={inputCls} {...register("status")}>
                  <option value="published">Published</option>
                  <option value="closed">Closed</option>
                </select>
                <p className="text-xs text-red-500 mt-0.5 min-h-[16px]">
                  {errors.status?.message}
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelCls}>Image</label>
                <Controller
                  name="image_key"
                  control={control}
                  render={({ field }) => (
                    <ImageUpload
                      value={field.value}
                      onChange={(file: File) => {
                        const ext = file.name.split(".").pop() ?? "bin";
                        const key = `${crypto.randomUUID()}.${ext}`;
                        field.onChange(key);
                        setValue("image_type", file.type, { shouldValidate: true });
                        imageFileRef.current = file;
                      }}
                    />
                  )}
                />
                <p className="text-xs text-red-500 mt-0.5 min-h-[16px]">
                  {errors.image_key?.message}
                </p>
                <p className="text-xs text-red-500 mt-0.5 min-h-[16px]">
                  {errors.image_type?.message}
                </p>
              </div>

              {error && (
                <p className="text-xs text-red-500">{(error as Error).message}</p>
              )}

              <Button
                variant="outlined"
                size="small"
                type="submit"
                disabled={isPending}
                sx={{ color: "#c9a84c", borderColor: "#c9a84c", alignSelf: "flex-start" }}
              >
                {isPending ? "Publishing…" : "Publish Article"}
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
    </>
  );
}

export default AddNews;
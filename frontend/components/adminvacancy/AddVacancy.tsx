import { Modal, Button, Box, Typography, Grid, TextField } from "@mui/material";
import { Plus } from "lucide-react";
import { useState, useRef } from "react";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { CreateJobForm, createJobSchema } from "@/schemas/job.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import React from "react";
import { JobPostingForm1, JobPostingForm2, JobPostingForm3 } from "./Forms";
import { FieldErrors } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminFetch } from "@/lib/adminFetch";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

function AddVacancy() {
  const [open, setOpen] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const imageFileRef = useRef<File | null>(null);
  const steps = [
    "Add basic details",
    "Add additional details",
    "Add complete details",
  ];

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const methods = useForm<CreateJobForm>({
    resolver: zodResolver(createJobSchema),
    defaultValues: {
      currency: "YEN",
      status: "Draft",
      contract: "Full_time",
      experience: -1,
      languages: [],
      technical_skills: [],
      shift_start: "09:00",
      shift_end: "17:00",
    },
  });

  const queryClient = useQueryClient();

  const createJob = async (formData: CreateJobForm) => {
    const res = await adminFetch(`${API_URL}/api/jobs`, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      const fieldErrors = body?.error?.fieldErrors as
        | Record<string, string[]>
        | undefined;
      if (fieldErrors) {
        const first = Object.entries(fieldErrors)[0];
        if (first) throw new Error(`${first[0]}: ${first[1][0]}`);
      }
      throw new Error(body?.messagge || body?.message || `Request failed (${res.status})`);
    }
    return body;
  };

  const { mutateAsync } = useMutation({
    mutationFn: createJob,
  });

  const onSubmit: SubmitHandler<CreateJobForm> = async (formData) => {
    try {
      if (imageFileRef.current) {
        const urlRes = await adminFetch(`${API_URL}/api/jobs/image-upload-url`, {
          method: "POST",
          body: JSON.stringify({
            image_key: formData.image_key,
            image_type: formData.image_type,
          }),
          headers: { "Content-Type": "application/json" },
        });
        const urlBody = await urlRes.json().catch(() => ({}));
        if (!urlRes.ok) throw new Error(urlBody?.message || "Failed to prepare image upload");
        const signedUrl = urlBody?.data?.signed_url;

        const putRes = await fetch(signedUrl, {
          method: "PUT",
          body: imageFileRef.current,
          headers: { "Content-Type": imageFileRef.current.type },
        });
        if (!putRes.ok) throw new Error("Image upload failed");
      }

      // Job row is only created after the image is safely in R2, so a failed
      // upload never leaves an orphaned Job row behind (previously the row was
      // created first, so a failed upload still consumed an autoincrement id).
      await mutateAsync(formData);

      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      alert("Job has been successfully created");
      methods.reset();
      setActiveStep(0);
      setOpen(false);
    } catch (err) {
      alert((err as Error).message || "Failed to create job");
    }
  };
  

  const onError = (errors: FieldErrors) => {
    const firstEntry = Object.entries(errors)[0];
    const [fieldName, error] = firstEntry;

    alert(
      error?.message
        ? `${fieldName}: ${error.message}`
        : `${fieldName}: Something went wrong`,
    );
  };

  return (
    <>
      <Button
        variant="outlined"
        className="border-primary"
        size="small"
        startIcon={<Plus />}
        sx={{ color: "#c9a84c", borderColor: "#c9a84c" }}
        onClick={() => {
          setOpen(!open);
          setActiveStep(0);
        }}
      >
        Add Job
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(!open)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        container={document.body}
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
            backgroundColor: "#f2f4f3",
            margin: 12,
            padding: 2,
            maxHeight: "100vh",
            overflow: "auto",
          }}
        >
          
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => {
              const stepProps: { completed?: boolean } = {};
              const labelProps: {
                optional?: React.ReactNode;
              } = {};
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit, onError)}>
              {activeStep === 0 && <JobPostingForm1 />}
              {activeStep === 1 && <JobPostingForm2 />}
              {activeStep === 2 && <JobPostingForm3 onFileChange={(f) => { imageFileRef.current = f; }} />}
            </form>
          </FormProvider>

          <React.Fragment>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button
                onClick={
                  activeStep === steps.length - 1
                    ? methods.handleSubmit(onSubmit, onError)
                    : handleNext
                }
              >
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            </Box>
          </React.Fragment>
        </Box>
      </Modal>
    </>
  );
}
export default AddVacancy;

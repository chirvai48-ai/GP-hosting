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
import { useMutation } from "@tanstack/react-query";

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
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    if (activeStep === steps.length - 1){
      setOpen(!open);
      methods.reset()
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

  const createJob = async(formData:unknown) =>{
    try{
      const res = await fetch(`${API_URL}/api/jobs`,{
            method:"POST",
            body:JSON.stringify(formData),
            headers:{
              "Content-Type":"application/json"
            }
          })
          return res.json()
    }
    catch(error){
      console.log(error);
    }
  }

  const {mutateAsync,isSuccess} = useMutation(
      {
       mutationFn:createJob
      }
    )

  const onSubmit: SubmitHandler<CreateJobForm> = async (formData) => {
    const result = await mutateAsync(formData);
    const signedUrl = result?.data?.signed_url;
    if (signedUrl && imageFileRef.current) {
      await fetch(signedUrl, {
        method: "PUT",
        body: imageFileRef.current,
        headers: { "Content-Type": imageFileRef.current.type },
      });
    }
    alert("Job has been successfully created");
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
              <Button onClick={handleNext}>
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

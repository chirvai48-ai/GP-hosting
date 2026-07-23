import { Router } from "express";
import { getJobs,getJobsById,postJobs,deleteJobs,updateJobs } from "../controllers/jobController";
import {validateCreate,validateUpdate } from "../middlewares/validate";
import { requireAuth } from "../middlewares/requireAuth";
import { createJobSchema,updateJobSchema } from "../schemas/job.schema";
/**
 * @swagger
 * components:
 *   schemas:
 *     Job:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: "Software Engineer"
 *         salary_min:
 *           type: integer
 *           example: 50000
 *         salary_max:
 *           type: integer
 *           example: 100000
 *         currency:
 *           type: string
 *           example: "YEN"
 *         location:
 *           type: string
 *           example: "Tokyo"
 *         experience:
 *           type: integer
 *           example: 2
 *         contract:
 *           type: string
 *           enum: [Full_time, Part_time, Contract, Internship]
 *           example: "Full_time"
 *         shift_start:
 *           type: string
 *           example: "09:00"
 *         shift_end:
 *           type: string
 *           example: "18:00"
 *         workdays:
 *           type: integer
 *           example: 5
 *         gender:
 *           type: string
 *           example: "Any"
 *         benefits:
 *           type: string
 *           example: "Health insurance, paid leave"
 *         requirements:
 *           type: string
 *           example: "Bachelor's degree in Computer Science"
 *         application_method:
 *           type: string
 *           example: "Email to hr@company.com"
 *         job_category:
 *           type: string
 *           example: "Engineering"
 *         languages:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Japanese", "English"]
 *         technical_skills:
 *           type: array
 *           items:
 *             type: string
 *           example: ["React", "Node.js"]
 *         soft_skills:
 *           type: string
 *           example: "Communication, teamwork"
 *         status:
 *           type: string
 *           enum: [Draft, Published, Closed]
 *           example: "Draft"
 *
 *     JobResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/Job'
 *
 *     JobsResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Job'
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Something went wrong"
 */

/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: Returns all jobs
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: Jobs fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JobsResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   post:
 *     summary: Create a new job
 *     tags: [Jobs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Job'
 *     responses:
 *       201:
 *         description: Job created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JobResponse'
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/jobs/{id}:
 *   get:
 *     summary: Get a job by ID
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The job ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Job fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JobResponse'
 *       404:
 *         description: Job not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   patch:
 *     summary: Update a job by ID
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The job ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Job'
 *     responses:
 *       200:
 *         description: Job updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JobResponse'
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Job not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   delete:
 *     summary: Delete a job by ID
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The job ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Job deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Job with id 1 successfully deleted"
 *                 data:
 *                   $ref: '#/components/schemas/Job'
 *       404:
 *         description: Job not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

const jobsRouter = Router();
jobsRouter.get("/", getJobs);
jobsRouter.get("/:id",getJobsById)
jobsRouter.post("/", requireAuth, validateCreate(createJobSchema), postJobs)
jobsRouter.delete("/:id", requireAuth, deleteJobs);
jobsRouter.patch("/:id", requireAuth, validateUpdate(updateJobSchema), updateJobs)

export default jobsRouter;
